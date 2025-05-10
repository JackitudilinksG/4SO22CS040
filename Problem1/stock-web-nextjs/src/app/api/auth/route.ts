import Fastify from 'fastify';
import fastifyHttpProxy from 'fastify-http-proxy';

const app = Fastify();

app.register(fastifyHttpProxy, {
  upstream: 'http://20.244.56.144',
  prefix: '/evaluation-service', // This will match the /evaluation-service route
  replyOptions: {
    onResponse: (request, reply) => {
      reply.header('Access-Control-Allow-Origin', '*'); // Adjust as needed
    },
  },
});

app.listen({ port: 3000 }, () => {
  console.log('Proxy server running on http://localhost:3000');
});
