### To handle publish failures
- Create an extra events table having all the events published
- keep a published flag and while saving txn to db, also save event to events table
- to make sure both things either pass or rollback together, use concept of db transaction