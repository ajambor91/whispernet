FROM confluentinc/cp-kafka:latest
COPY ./config/server.properties /opt/kafka/config/server.properties
COPY ./topics.sh /usr/bin
CMD ["sh", "/usr/bin/topics.sh"]

CMD ["kafka-server-start", "/opt/kafka/config/server.properties"]
