FROM confluentinc/cp-kafka
COPY ./config/server.properties /opt/kafka/config/server.properties
COPY ./topics.sh /usr/bin
ENTRYPOINT ["sh", "-c", "rm -rf /var/lib/kafka/data/* && /usr/bin/topics.sh && kafka-server-start /opt/kafka/config/server.properties"]
