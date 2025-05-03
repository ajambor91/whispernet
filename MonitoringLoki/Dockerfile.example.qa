FROM grafana/loki:2.9.4

COPY loki-config.yaml /etc/loki/local-config.yaml

CMD ["-config.file=/etc/loki/local-config.yaml"]