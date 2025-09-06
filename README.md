# README #

### For any update to get ID use useGetQuery hook! ###

* use case: const {id} = useGetQuery('update-center')
* here you can pass the param what you need by default it will replace only "update-" if you didn't pass anything
* id = 1 or any id whatever you send as id
* send use case: Router.push(`/center-management/update-center-${record.id}`) if the url is "update-${record.id}" you dont need to pass the params in useGetQuery()


