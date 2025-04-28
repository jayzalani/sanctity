# Commets Application Build with Nextjs and Drizzle Along with Neon SQL Database 
Clone the code and setup .env.local file with that setup
`DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=`

Upstash Redis is used for RateLimiting in backend Means if user tries to mimic the DDOS Attack or Denial of Service it will prevent them and 
will make overall application Safe and secure
## After setting up in Local Start the Neon Database console by doing this command
`npm run db:studio
//Or go Scripts and see there are other options for migration and Schema definitions
` 
See the Images below for reference
![image](https://github.com/user-attachments/assets/b469362a-48cd-4893-ad41-60c5435736d7)

![image](https://github.com/user-attachments/assets/4aff1e77-0d9c-448f-b6c0-da0c0541a918)

## After This, Do 
`npm run dev`
If done correctly Application will run First You have to make account by clicking on Create Account or visiting this link 
`http://localhost:3000/sign-in`
or
`http://localhost:3000/sign-up`
And GO YOUR DONE😎
# Description
### Here Used SQL Modern SQL Database Non for scaling and Stablity NEON Database, with the help of UPStash Redis Architecture usefull for Managing higher traffic loads and 
safe and secure workflow apart, for proper SQL Schema validations  ORM used here is Drizzler, one can use Prisma or any preferred, For FrontEnd used Library are GSAP, and Shadcn for components
This Applicatuion not only provides a good Authentic Experience but also follows good industry practices such as converting user password in complex Hash such that database admin can not see the actial password
using library such Bcrypt JS and using JWT I solve this Functionality
## This is the Industry Grade  platform build with Typescript and Tailwindcss
# Live Link
https://sanctity-jmnt8tfc3-jayzalanis-projects.vercel.app/sign-in
