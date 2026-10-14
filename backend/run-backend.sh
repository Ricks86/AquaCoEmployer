#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1
if [ -d "$HOME/.jdks/temurin-21.0.11" ]; then
    export JAVA_HOME="$HOME/.jdks/temurin-21.0.11"
else
    export JAVA_HOME=/usr/lib/jvm/java-25-openjdk
fi
export PATH="$JAVA_HOME/bin:$PATH"

/home/duckyrichii/.m2/wrapper/dists/apache-maven-3.9.14-bin/1cb7fhup6b5n3bed6kckbrnspv/apache-maven-3.9.14/bin/mvn spring-boot:run
