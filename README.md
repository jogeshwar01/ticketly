# Ticketly

### Tech Stack: 

* **NATS Streaming Server** Implementation
* **Docker and Kubernetes** and _Ingress-Nginx_
* **NPM library**  - https://www.npmjs.com/package/@js-ticketly/common
* **The Services** are written with: Node.js , Express , TypeScript  , JavaScript
* **The Client** is written with: React.js and Next.js as _Server Side Redered App_
* MongoDB as my database (Documents)
* Tests with jest, supertest and mongodb-memory-server
* BullJS, Redis

### To handle publish failures
- Create an extra events table having all the events published
- keep a published flag and while saving txn to db, also save event to events table
- to make sure both things either pass or rollback together, use concept of db transaction

- need to build an image for a service

docker build -t jogeshwarsingh/<service-name> .