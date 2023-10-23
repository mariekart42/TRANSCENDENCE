
# NestJS   
[Reference](https://docs.nestjs.com/first-steps)

- **[Install NestJS](Installation.md)**
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

- **Setting up [Database:](https://www.postgresql.org/)**
	- [Docker set-up:](https://docs.docker.com/compose/gettingstarted/)
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
	- [Prisma:](https://www.prisma.io/)
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
				- also run for any changes made in prisma schema
				- generated sql in new folder migrations
				- migrations/
				  └─ 20231020154424_init_new_lol/
					    └─ migration.sql
				- database now knows about tables we created as models in ```schema.prisma```
			- run ```npx prisma generate``` to automatically add model content into program
			- run ```npx prisma studio``` to open prisma interface in browser
		- **Connect Prisma with Code:**
			- create Folder in src (prisma) with module file
	- Validation:
		- install [Class Validator](https://docs.nestjs.com/techniques/validation) (from NestJS)
			- ```npm i --save class-validator class-transformer```
		- in dto we now can use special decorators provided by class-validator like:
			- ```@IsString(), @IsNotEmpty(), @IsEmail()```
				- will check for these cases and will throw error if not valid
			- -> Business logic code afterwards only runs, if validationPipe is satisfied
	- Hash password:
		- received password from user gets hashed -> security reasons
			- ! [bycript](https://www.npmjs.com/package/bcrypt) only handles 72 bytes, we won't use that but [argon2](https://argon2.online/)
		- run ```npm add argon2``` to install argon2
		- import argon2 into code:  ```import * as argon from 'argon2'```
		- generate password hash:
			- ```const hash = argon.hash(dto.password)```
		- save new user to database:
		```
			const user = await this.prisma.user.create({  
				data: {  
					email: dto.email,  
					hash: hash,  
				}  
			})
		```
	- scripts json:
		- restart Database:
			1. remove container:
				- ```"db:dev:rm": "docker compose rm <db_name> -f -s -v"```
					- eg. ```docker compose rm marieee -f -s -v```
			2. create container:
				- ```"db:dev:up": "docker compose up <db-name> -d"```
			- concatenate both statements:
				- ```"db:dev:restart": "npm run db:dev:rm && npm run db:dev:up"```
			- run ```npm run db:dev:restart```
			- BUT migrations are not applied yet
			- apply migrations:
			- but now we don't want to create each time a new migration but implement the new content on top of the old one (=migrate)
			- apply migrations:
				- ```"prisma:dev:deploy": "prisma migrate deploy"```
			- concatenate with restart db:
				- ```"db:dev:restart": "npm run db:dev:rm && npm run db:dev:up && npm run prisma:dev:deploy"```
			- ! slow devices may need more time, we only want to deploy if container already restarted == ```sleep 15```
				- sometimes says that port can't be reached, then set the time higher
		- => ```"db:dev:restart": "npm run db:dev:rm && npm run db:dev:up && sleep 15 && npm run prisma:dev:deploy"```
	- [Authentication:](https://docs.nestjs.com/security/authentication)
		-  config Module:
			- ```run npm add @nestjs/config```
			-  import it to app.module
		- NestJS uses [Passport](https://www.passportjs.org/)  and [JWT](https://jwt.io/) so we have to install it:
			- ```npm add @nestjs/passport passport```
			- ```npm add @nestjs/jwt passport-jwt```
			- ```npm add -D @types/passport-jwt```
		- import JWTModule to auth.module
		- 








Nest automatically identifies Content-Type :)

