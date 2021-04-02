import axios from 'axios';

export default class CreateUserService {

    sendRequest(name, job) {
        return axios.post("https://reqres.in/api/users", {
            "name" : name,
            "job" : job
        }).then(res => res.data)
    }
}