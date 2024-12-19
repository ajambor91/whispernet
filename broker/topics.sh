kafka-topics --bootstrap-server broker:9092 --create --topic request-client-topic --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server broker:9092 --create --topic request-ws-token-topic --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server broker:9092 --create --topic request-init-ws-session-topic --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server broker:9092 --create --topic request-joining-client-topic --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server broker:9092 --create --topic request-return-client-topic --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server broker:9092 --create --topic request-initialization-topic --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --bootstrap-server broker:9092 --create --topic request-websocket-session-topic --partitions 3 --replication-factor 1 --if-not-exists
