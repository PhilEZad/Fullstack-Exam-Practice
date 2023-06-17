/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 *
 * const admin = require('firebase-admin');
 * const functions = require('firebase-functions')
 * admin.initializeApp({projectId: 'Firebase-Exam-Practice'})
 *
 * const toxicity = require('@tensorflow-models/toxicity')
 *
 * const app = require('express')();
 * const cors = require('cors');
 * app.use(cors());
 *
 * const isThisMessageClean = async (message) => {
 *     const model = await toxicity.load(0.7);
 *     const result = await model.classify(message)
 *     let fault = [];
 *
 *     result.forEach(e =>{
 *         e.results.forEach(r => {
 *             if(r.match)
 *             {
 *                 fault.push(e.label);
 *             }
 *         })
 *     })
 *     return fault;
 * }
 *
 * app.post("/messageFilter", async (req, res) => {
 *     const body = req.body;
 *     const result = await isThisMessageClean(body.messageContent);
 *
 *     if(result.length===0)
 *     {
 *         body.timestamp = new Date();
 *         const writeresult =
 *             await admin.firestore().collection('myChat').add(body);
 *         return res.status(201).json(writeresult);
 *     }
 *     return res.status(400).json(
 *         {
 *             message: 'You are being toxic',
 *             results: result
 *         }
 *     )
 * })
 *
 * exports.api = functions.https.onRequest(app);
 */