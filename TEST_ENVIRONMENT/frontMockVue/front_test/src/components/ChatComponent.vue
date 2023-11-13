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
    <label for="username">Invite User:</label><br>
      <input type="text" id="username" v-model="invited_user" /><br><br>
    <button @click="inviteUserToChat(this.userDataObject.user_data.id, this.chatData.id, this.invited_user)">Send Invite</button><br><br>
    <button @click="closeChatWindow">Go Back to Chats</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatName: '',
      userChats: [],
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
          console.log('SOME SUCCESS LOL')
        }
        else {
          console.error('Error Invite User to chat:', data.error);
        }
      }
      catch (error) {
        console.error('Error Invite User to chat:', error);
      }
    },


    async openChatWindow(chat_id, user_id) {
      try {
        const response = await fetch(`http://127.0.0.1:6969/user/getChatData/${user_id}/${chat_id}/`);
        const data = await response.json()
        if (response.ok)
        {
          this.insideChatFlag = true
          this.chatData.id = data.chat_data.id
          this.chatData.name = data.chat_data.name
          // this.chatData.messages = data.chat_data.messages
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
        console.log(this.userDataObject.user_data.id)
        const response = await fetch(`http://127.0.0.1:6969/user/getUserChats/${this.userDataObject.user_data.id}/`);
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