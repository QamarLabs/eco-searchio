import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from "openai";
import { MongoClient, ServerApiVersion } from "mongodb";
// import Embeddings from 'basic-embeddings.js';
import { Web3Storage } from "web3.storage";
import pako from 'pako';

export const config = {
  runtime: 'edge',
};
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const url = `mongodb+srv://${process.env.MONGODB_USERNME}:${process.env.MONGODB_PWD}@nooganaega.uwgsadn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// function dotProduct(float1, float2) {
//   let currentValue = 0;
//   for (let i = 0; i <= float1.length; i++) {
//     currentValue += float1[i] * float2[i];
//   }
//   return currentValue;
// }

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  const similarity = dotProduct / (normA * normB);
  return similarity;
}


export async function readFileFromWeb3Storage(client, cid) {
  const res = await client.get(cid);
  const files = await res.files()
  const fileData = Buffer.from(await files[0].arrayBuffer());
  const decompressedD = pako.inflate(fileData, { to: 'string' });
  // console.log(JSON.parse(decompressedD.toString()).data.length)
  return Array.from(new Set(JSON.parse(decompressedD.toString()).data))
                        .map(d => JSON.parse(d)).filter(dt => dt.title.trim() !== "Your browser indicates if you've visited this link");
}

export default async function handler(req, res) {
  const { searchTerm } = req.body;
  let articles = [];
  try {
    const web3StorageClientToken = process.env.WEB3STORAGE_API_KEY;
    const web3StorageClient = new Web3Storage({
      token: web3StorageClientToken
    });
    for await (const upload of await web3StorageClient.list()) {
      const data = await readFileFromWeb3Storage(web3StorageClient, upload.cid);
      const arrData = data;
      const openAiInput = arrData.map(d => d.title);
      const { data: searchTermEmbedding } = await openai.createEmbedding({
        input: searchTerm,
        ...openAiInput,
        model: "text-embedding-ada-002",
      });
      const { data: articleEmbeddings } = await openai.createEmbedding({
        input: openAiInput,
        model: "text-embedding-ada-002",
      });
      for (var i = 0; i < articleEmbeddings.data.length; i++) {
        const currentEmbedding = articleEmbeddings.data[i].embedding;
        const similarity = cosineSimilarity(
          currentEmbedding,
          searchTermEmbedding.data[0].embedding
        );
        arrData[i].similarity = similarity;
      }
      articles = [...articles, ...data];

    }
    
    const results = articles
                    .filter((a) => a.similarity > 0.75)
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, 1000);
    console.log('results:', results);
    return NextResponse.json({
      articles: results,
    });
    // return res.json({ articles: [] });
  } catch (err) {
    console.log('err:', err);
    return res.json(err);
  }

}
