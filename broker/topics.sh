kafka-topics --bootstrap-server broker:9092 --create --topic request-client-topic --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server broker:9092 --create --topic request-ws-token-topic --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server broker:9092 --create --topic request-init-ws-session-topic --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server broker:9092 --create --topic request-joining-client-topic --partitions 1 --replication-factor 1
