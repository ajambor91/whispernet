kafka-topics --bootstrap-server broker:9092 --create --topic request-user-token-topic --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server broker:9092 --create --topic request-ws-token-topic --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server broker:9092 --create --topic request-ws-startws-topic --partitions 1 --replication-factor 1
