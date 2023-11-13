<!-- ChatComponent.vue -->

<template>
  <div v-if="!insideChatFlag">
    <h2>My Chats</h2>
    <ul>
      <!--for loop that iterates through userChats Array-->
      <li v-for="chat in userChats" :key="chat.id">
        <button @click="openChatWindow(chat.id, this.userDataObject.user_data.id)">{{ chat.chatName }}</button>
      </li>
    </ul><br>
    <h3><label for="text">Create new Chat:</label></h3>
    Enter Chat Name:
    <input type="text" id="newChat" v-model="chatName" />
    <button @click="createChat">Create</button><br><br><br><br>
  </div>

<!--  INSIDE OF SELECTED CHAT-->
  <div v-else>
    <h2>Chatroom: &nbsp;{{this.chatData.name}}</h2><br><br>
    <button @click="closeChatWindow">Go Back to Chats</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatName: '',
      userChats: [],

      chatData: {
        name: '',
        messages: [],  // not sure about this rn
      },

      insideChatFlag: false,
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
    async openChatWindow(chat_id, user_id) {
      try {
        console.log("USER_ID: ", user_id)
        console.log("CHAT_ID: ", chat_id)
        const response = await fetch(`http://127.0.0.1:6969/user/getChatData/${user_id}/${chat_id}/`);
        const data = await response.json()
        if (response.ok)
        {
          this.insideChatFlag = true
          this.chatData.name = data.chat_data.name
          this.chatData.messages = data.chat_data.messages
        }
        else
        {
          console.error('Error open Chat Window:', data.error);
          this.insideChatFlag = false
        }
      }
      catch (error) {
        console.error('Error open Chat Window:', error);
        this.insideChatFlag = false
      }
    },

    closeChatWindow() {
      this.insideChatFlag = false
    },
    async createChat() {
      try
      {
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