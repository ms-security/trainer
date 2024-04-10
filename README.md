# SSV (Security Smells Visualizer)

![License](https://img.shields.io/github/license/UnimibSoftEngCourse2022/riskgame-malnati-negro-persico-romano-radaelli-mvc-guru-1)
![Stars](https://img.shields.io/github/stars/UnimibSoftEngCourse2022/riskgame-malnati-negro-persico-romano-radaelli-mvc-guru-1)

## Project Execution

### Prerequisites

- [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven](https://maven.apache.org/install.html) (3.1 or >)
- [Git](https://git-scm.com/downloads)

### Import and Installation

- `git clone https://github.com/AndreaMalnati/SSV.git`: to clone the repository locally.

*The following commands should be executed inside the root directory of the repository*

- `mvn package`: Executes the build of the server and its tests.
  If the tests are successful, it also builds the client inside src/main/app and copies the generated files
  into target/static, where target/ is the folder containing the server's compiled files.
  Finally, it creates the complete .jar package.

- `java -jar target\SSV-1.0-SNAPSHOT.jar`: Runs the previously generated .jar file.

- The server is now accessible at `localhost:8080`.



*made by Andrea Malnati, Roberto Negro*

