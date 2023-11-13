<!-- ChatComponent.vue -->

<template>
  <div>
    <h2>My Chats</h2>
    <ul>
      <!--for loop that iterates through userChats Array-->
      <li v-for="chat in userChats" :key="chat.id">
        {{ chat.chatName }}
      </li>
    </ul><br>
    <h3><label for="text">Create new Chat:</label></h3>
    Enter Chat Name:
    <input type="text" id="newChat" v-model="chatName" />
    <button @click="createChat">Create</button><br><br><br><br>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatName: '',
      userChats: [],
      createChatFlag: false,
    }
  },

  props: {
    userDataObject: {
      type: Object, // comes from prev file LoginRegister.vue
      required: true,
    },
    fetchUserDataFunc: {
      type: Function,
      required: true,
    },
  },


  methods: {

    async createChat() {
      try
      {
        console.log('USER_ID: ')
        console.log(this.userDataObject.user_data.id)
        const myInit = {
          method: "POST",
        };
        const response = await fetch(`http://127.0.0.1:6969/user/createChat/${this.userDataObject.user_data.id}/${this.chatName}/`, myInit);
        console.log('RESPONSE: ')
        console.log(response)
        const data = await response.json();
        if (response.ok)
        {
          this.getUsersChats()
          this.chatName = ''
          // this.userChats = data.allChats
          console.log('CREATED CHAT SUCCESS')
        }
        else {
          this.errorMessage = data.error;
        }
      }
      catch (error) {
        console.error('Error creating new Chat:', error);
      }
    },

    async getUsersChats() {
      try
      {
        console.log('USER_ID: ')
        console.log(this.userDataObject.user_data.id)
        const response = await fetch(`http://127.0.0.1:6969/user/getUserChats/${this.userDataObject.user_data.id}/`);
        console.log('RESPONSE: ')
        console.log(response)
        const data = await response.json();
        if (response.ok)
        {
          this.userChats = data.allChats
          console.log('CREATED CHAT SUCCESS')
        }
        else {
          this.errorMessage = data.error;
        }
      }
      catch (error) {
        console.error('Error creating new Chat:', error);
      }
    },
  },

  mounted() {
    this.getUsersChats()
  },
};

</script>