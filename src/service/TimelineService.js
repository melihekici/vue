import axios from 'axios'

export default class TimelineService {

	getTimeline() {
    
		return axios.get("https://reqres.in/api/unknown?per_page=2213132132").then(res => res.data.data);
  }
}