# Kinvey Flex Connector to Persist Entities

## This reference shows a low code mechanism to save entities persisted to a Kinvey collection back to their backend system of record (in this case MSSQL)

From the client, the records will be sved back to the ordercache collection.  The ordercache collection has a postSave hook defined on it.  This gets triggered if data from the client is inserted or updated.  Since it is a postSave hook, normal processing will follow (i.e. the order will get persisted back to the Kinvey ordercache collection), but then afterwards, the hook will intercept the collection.  The hook is implemented in our Flex Services Runtime.  It takes the entity passed to it, spits out the order header from the order details, and persist those by invoking the orderheader and orderdetail collections (which are backed by RAPID MSSQL).
