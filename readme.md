This is a node js based polling application API, which uses mongose, nodejs, express and passportjs 

The post man collection is also provided in the server folder

This application is also deployed on https://vercel.com/ but sometime this application does not work and thats because mongodb atlas is left idle for long time it sleeps the cluster.


On local host
curl -X POST http://localhost:5005/api/users/register -H "Content-Type: application/json" -d '{"name":"sam","email":"sam@sam.com","password":"111111","password2":"111111"}'

 
 
On Vercel
for register
curl -X POST https://lastpoll-12njfxez6-syed-kazmi.vercel.app/api/users/register -H "Content-Type: application/json" -d '{"name":"sam","email":"sam@sam.com","password":"111111","password2":"111111"}'

for sign in 
curl -X POST https://lastpoll-12njfxez6-syed-kazmi.vercel.app/api/users/login -H "Content-Type: application/json" -d '{"name":"sam","email":"sam@sam.com","password":"111111","password2":"111111"}'


For poll creation 
curl -X POST https://lastpoll-12njfxez6-syed-kazmi.vercel.app/api/poll -H "Content-Type: application/json" -d '{"text":"is honda a good car?","name":"question about Honda","endDate":"Mon Jul 11 2023 19:48:54 GMT+0500","startDate":"Mon Jul 11 2022 19:48:54 GMT+0500", "choices":[{"choicetext":"Yes"}, {"choicetext":"No"}, {"choicetext":"Maybe"}]}'

Get Poll
curl -X GET https://lastpoll-12njfxez6-syed-kazmi.vercel.app/api/poll -H "Content-Type: application/json" 


Vote for poll creation 
curl -X POST https://lastpoll-12njfxez6-syed-kazmi.vercel.app/api/poll/62cc4dc432ee577333980b8b/vote/62cc4dc432ee577333980b8d -H "Content-Type: application/json"  -H "Authorization: Bearer {token}"


Delete poll 
curl -X DELETE https://lastpoll-12njfxez6-syed-kazmi.vercel.app/api/poll/5d581a8a6174a760aa35302d -H "Content-Type: application/json"  -H "Authorization: Bearer {token}"

