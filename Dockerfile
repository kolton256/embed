FROM bitnami/nginx

COPY .docker/nginx.conf /opt/bitnami/nginx/conf/nginx.conf
COPY .docker/entrypoint.sh .
COPY .docker/replaceEnvVars.sh .
COPY build/ /usr/share/nginx/html

USER 0

RUN chmod +x replaceEnvVars.sh

USER 1001

CMD [ "sh", "replaceEnvVars.sh", "/usr/share/nginx/html", "&&", "/opt/bitnami/scripts/nginx/run.sh" ]
