plugins {
    id("java")
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    compileOnly("org.projectlombok:lombok:1.18.46")
    annotationProcessor("org.projectlombok:lombok:1.18.46")

    testImplementation(platform("org.junit:junit-bom:6.0.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // JPA API
    implementation("jakarta.persistence:jakarta.persistence-api:3.1.0")
    // Implementación de JPA (Hibernate)
    implementation("org.hibernate.orm:hibernate-core:7.3.5.Final")
    // Base de datos en memoria H2
    runtimeOnly("com.h2database:h2:2.4.240")
    // Logger (opcional pero recomendable)
    implementation("org.slf4j:slf4j-simple:2.0.18")


}

tasks.test {
    useJUnitPlatform()
}


tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.withType<JavaExec> {
    jvmArgs("-Dfile.encoding=UTF-8")
    systemProperty("file.encoding", "UTF-8")
    systemProperty("stdout.encoding", "UTF-8")
}