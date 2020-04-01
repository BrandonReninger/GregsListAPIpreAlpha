import Job from "../Models/Job.js"
import _store from '../store.js'
import store from "../store.js"


// @ts-ignore
let _api = axios.create({
    baseURL: '//bcw-sandbox.herokuapp.com/api/jobs',
    timeout: 5000
})


class JobService {
    create(newJobObject) {
        _api.post('', newJobObject)
            .then(res => {
                console.log(res.data)
                let newJob = new Job(res.data.data)
                let jobs = [newJob, ...store.State.houses]
                store.commit('jobs', jobs)
            }).catch(err => console.error(err))
    }


    bid(houseId) {
        let foundHouse = store.State.houses.find(house => house.id == houseId)
        if (houseId) {
            foundHouse.price += 1000
            _api.put(houseId, foundHouse)
                .then(res => {
                    this.getJobs()
                }).catch(err => console.error(err))
        }
    }

    getJobs() {
        _api.get()
            .then(res => {
                let jobs = res.data.data.map(rawJobData => new Job(rawJobData))
                store.commit('jobs', jobs)
                console.log(store.State)
            }).catch(err => console.error(err))
    }

    delete(jobId) {
        _api.delete(jobId)
            .then(res => {
                console.log(res.data)
            }).catch(err => console.error(err))
    }

    constructor() {
        this.getJobs()
    }

}


const JOBSERVICE = new JobService()
export default JOBSERVICE