FROM grafana/loki:2.5.0

COPY loki-config.yaml /etc/loki/local-config.yaml

CMD ["-config.file=/etc/loki/local-config.yaml"]