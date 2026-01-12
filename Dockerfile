# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Set the work directory for the application
WORKDIR /app
 
# Set the environment path to node_modules/.bin
ENV PATH=/app/node_modules/.bin:$PATH

# COPY the needed files to the app folder in Docker image
COPY ./ /app/

# Get the needed libraries to run Playwright
RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev \
                        libxkbcommon-dev libgbm-dev libasound-dev \
                        libatspi2.0-0 libxshmfence-dev

# Add java for Allure report
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
RUN export JAVA_HOME


# Install the dependencies in Node environment
RUN npm cache clean --force
RUN npm install
RUN npm install -g playwright
ENTRYPOINT ["/bin/sh"]