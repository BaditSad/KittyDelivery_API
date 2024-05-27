import axios from 'axios';
export default {
  data() {
    return {
      message: "ok"
    };
  },
  async created() {
    this.message = await axios.get('http://localhost:3000/message');
  }
};
