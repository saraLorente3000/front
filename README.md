*For the proper functioning of the api it is necessary to modify the env file with the url of the email microservice

*This microservice would be a gcloud cloud run

*To execute it, first the image would be created
gcloud builds submit --tag gcr.io/proyect/nameImage

*Finally, the cloud run would be deployed
gcloud run deploy --image gcr.io/proyect/nameImage --platform managed

*For the network to be secure when deploying it, it should be indicated that unauthenticated calls are not allowed
*To make the call from another api you would have to do it following the code

const {GoogleAuth} = require('google-auth-library');
const auth = new GoogleAuth();

async function request() {
  const client = await auth.getIdTokenClient(url);
  const res = await client.request({url});
}

request().catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});
