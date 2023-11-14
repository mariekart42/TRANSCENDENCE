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
    <h3>User:</h3>
    <ul>
      <!--for loop that iterates through userChats Array-->
      <li v-for="(user, index) in chatUser" :key="index">
        {{ user }}
      </li>
    </ul><br>

    <label for="username">Invite User:</label>
      <input type="text" id="username" v-model="invited_user" />
    <button @click="inviteUserToChat(this.userDataObject.user_data.id, this.chatData.id, this.invited_user)"> Send Invitation</button><br><br><br>
    <!--DISPLAY ERROR-->
      <div v-if="errorMessage" :style="{ color: errorColor }">
        <p>{{ errorMessage }}</p>
      </div>
      <div v-else-if="successMessage" :style="{ color: successColor }">
        <p>{{ successMessage }}</p>
      </div>
    <button @click="closeChatWindow">Go Back to Chats</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: null,
      successMessage: null,
      errorColor: 'red',
      successColor: 'green',
      chatName: '',
      userChats: [],
      chatUser: [],
      invited_user: '',

      chatData: {
        id: 0,
        name: '',
        // messages: [],  // not sure about this rn
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
    async inviteUserToChat(user_id, chat_id, invited_user) {
      try
      {
        if (!invited_user.trim())
        {
          this.errorMessage = 'Please enter a username!';
          return;
        }
        const response = await fetch(`http://127.0.0.1:6969/user/inviteUserToChat/${user_id}/${chat_id}/${invited_user}/`);
        const data = await response.json()
        if (response.ok)
        {
          this.errorMessage = null
          this.successMessage = 'Send Invitation successfully'
        }
        else {
          this.errorMessage = data.error;
          console.error('Error Invite User to chat:', data.error);
        }
      }
      catch (error) {
        this.errorMessage = error;
        console.error('Error Invite User to chat:', error);
      }
    },

    async openChatWindow(chat_id, user_id) {
      try {
        const response = await fetch(`http://127.0.0.1:6969/user/getChatData/${user_id}/${chat_id}/`);
        const data = await response.json()
        if (response.ok)
        {
          this.errorMessage = null
          this.insideChatFlag = true
          this.chatData.id = data.chat_data.id
          this.chatData.name = data.chat_data.name
          this.chatUser = data.chat_data.user
          // this.chatData.messages = data.chat_data.messages
        }
        else
        {
          console.error('Error open Chat Window:', data.error);
          this.errorMessage = data.error;
          this.insideChatFlag = false
        }
      }
      catch (error) {
        console.error('Error open Chat Window:', error);
        this.errorMessage = error;
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
        const data = await response.json();
        if (response.ok)
        {
          this.errorMessage = null
          this.getUsersChats()
          this.chatName = ''
        }
        else {
          this.errorMessage = data.error;
        }
      }
      catch (error) {
        console.error('Error creating new Chat:', error);
        this.errorMessage = error;
      }
    },

    async getUsersChats() {
      try
      {
        console.log(this.userDataObject.user_data.id)
        const response = await fetch(`http://127.0.0.1:6969/user/getUserChats/${this.userDataObject.user_data.id}/`);
        const data = await response.json();
        if (response.ok)
        {
          this.errorMessage = null
          this.userChats = data.allChats
        }
        else {
          this.errorMessage = data.error;
        }
      }
      catch (error) {
        console.error('Error creating new Chat:', error);
        this.errorMessage = error;
      }
    },

  },

  mounted() {
    this.getUsersChats()
  },
};

</script>