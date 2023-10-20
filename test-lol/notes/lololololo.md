
# NestJS   
[Reference](https://docs.nestjs.com/first-steps)

- **[Installation](Installation.md)**
- **[Run Program](Run_Program.md)**

- Controllers:
	- handle incoming HTTP requests and return responses
-  Services:
	- handle Business Logic like connecting to Database



- **Code stuff:**
	- export class:
		-  class that is available in the whole program

	- Constructor:
		- ```constructor(private name_of_Instance: AuthService) { }```
		- constructor inits and creates Instance of AuthService

	- ???:
		- await
		- async
		- Promise
		- interface (something like struct?)
		- class name **implements** name

- **Setting up Database:**
	- Docker set-up:
		- run ```docker ps``` to check if docker works
		- run ```docker compose up <name> -d``` to start the container
		- ! make sure everything is set up in ``` docker-compose.yml```  file
		``` 
			- marieee:  
				image: postgres:13  
				ports:  
				- 5434:5432  
				environment:  
				POSTGRES_USER: postgres  
				POSTGRES_PASSWORD: 6969  
				POSTGRES_DB: nest
		``` 
		- run ```docker ps``` again and copy the ```CONTAINER ID```
		- then run ```docker logs <CONTAINER ID>```
			- it should show: ```database system is ready to accept connections```
	- Prisma:
		- *connection between TypeScript code and Database*
		- **Set up:**
			- got to the root of the project (NOT inside src)
			- run ```npm add -D prisma```
				- adds the Prisma CLI (Command Line Interface) as a development dependency to your project
			- and ```npm add @prisma/client```
				- add the Prisma Client package as a dependency to your project
			- run ```npx prisma init```
				- creates all necessary files in the current directory
				- created .env file with ```DATABASE_URL``` string in it
					- eg. ```DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"```
				- and an prisma folder with ```schema.prisma``` file inside
					- here we will declare our Modules
				```
				model User {
					id Int @id @default(autoincrement())
					email String @unique
					name String?
					posts Post[]
				}
				
				model Post {
					id Int @id @default(autoincrement())
					title String
					content String?
					published Boolean @default(false)
					author User @relation(fields: [authorId], references: [id])
					authorId Int
				}
				```
			- set ```DATABASE_URL``` in ```.env``` file:
				- ```DATABASE_URL="postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>d@localhost:<ports>/<POSTGRES_DB>?schema=public"```
				- place data from ```docker-compose.yml``` file in there
				- --> prisma is now able to access out local Database (docker instance)
			- run ```npx prisma --help``` for any help
		- **Migrate:**
			- run ```npx prisma migrate dev```
				- generated sql in new folder migrations
				- migrations/
				  └─ 20231020154424_init_new_lol/
					    └─ migration.sql
				- database now knows about tables we created as models in ```schema.prisma```
			- run ```npx prisma generate``` to automatically add model content into program
			- run ```npx prisma studio``` to open prisma interface in browser
		- **Connect Prisma with Code:**
			- create Folder in src (prisma) with module file


Nest automatically identifies Content-Type :)

