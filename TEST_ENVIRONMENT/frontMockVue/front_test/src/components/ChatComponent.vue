<!-- ChatComponent.vue -->

<template>
  <div v-if="!insideChatFlag">
    <h2>My Chats</h2>
    <ul>
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
      <div v-for="(message, index) in messages" :key="index" :class="{ 'own-message': isOwnMessage(message.sender) }">
        <!--DISPLAY OWN MESSAGE-->
        <div v-if="isOwnMessage(message.sender)">
            <div class="own-message-text" style="max-width: 70%">
          <strong>You</strong><br>
          <div class="text-break" style="word-break: break-all;">
              {{ message.text }}
            </div>
            <div class="timestamp" :style="{ 'font-size': '14px' }">
              {{ message.timestamp }}
            </div>
          </div>
        </div>

        <!--DISPLAY OTHER MESSAGE-->
        <div v-else>
          <div class="other-message-text" style="max-width: 70%">
            <strong>{{ message.sender }}</strong><br>
            <div class="text-break" style="word-break: break-all;">
              {{ message.text }}
            </div>
            <div class="timestamp" :style="{ 'font-size': '14px' }">
              {{ message.timestamp }}
            </div>
            </div>
        </div><br>
      </div>
      <div class="input-group mb-6">
        <input
          type="text"
          class="form-control"
          placeholder="Type your message..."
          v-model="current_message"
          @keyup.enter="current_message"
        />
        <button @click="createMessage(this.userDataObject.user_data.id, this.chatData.id, current_message)" class="btn btn-primary">Send</button><br><br><br>
      </div>
    <ul>
      <li v-for="(user, index) in chatUser" :key="index">
        {{ user }}
      </li>
    </ul><br><br><br><br>

    <div class="row">
      <!-- Username Input -->
      <div class="col-md-3 mb-3">
        <input type="text" class="form-control" id="username" v-model="invited_user" placeholder="username">
        <button @click="inviteUserToChat(this.userDataObject.user_data.id, this.chatData.id, invited_user)" class="btn btn-primary"> Send Invitation</button><br><br><br>
      </div>
    </div>

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
      current_message: '',

      messages: [
        {
          id: 0,
          sender: '',
          text: '',
          timestamp: 0,
        }
      ],

      chatData: {
        id: 0,
        name: '',
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

    isOwnMessage(sender) {
      return sender === this.userDataObject.user_data.name;
    },

    async getChatMessages(chat_id) {
      try
      {
        const response = await fetch(`http://127.0.0.1:6969/user/getChatMessages/${chat_id}/`);
        const data = await response.json();
        if (response.ok)
        {
          this.errorMessage = null
          this.messages = data.message_data;
        }
        else {
          this.errorMessage = data.error;
          console.error('Error getChatMessages:', data.error);
        }
      }
      catch (error) {
        this.errorMessage = error;
        console.error('Error getChatMessages:', error);
      }
    },

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
          this.invited_user = null
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

    async createMessage(user_id, chat_id, text)
    {
      try
      {
        const myInit = {
          method: "POST",
          body: JSON.stringify({
            text: text,
          }),
        };
        const response = await fetch(`http://127.0.0.1:6969/user/createMessage/${user_id}/${chat_id}/`, myInit);
        const data = await response.json()
        if (response.ok)
        {
          this.current_message = null
          console.log('RESPONSE FROM CREATE_MESSAGE oK ')
          await this.getChatMessages(chat_id)
        }
        else
        {
          this.errorMessage = 'Error in create Message'
          console.error('Error in create Message: ', data.error)
        }
      }
      catch (error)
      {
        this.errorMessage = 'Error in create Message'
        console.error('Error in create Message: ', error);
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
          this.chatData = data.chat_data
          await this.getChatMessages(chat_id)
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
          await this.getUsersChats()
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


<style scoped>
.own-message {
  text-align: right;
}

.own-message-text {
  background-color: #e6e6e6;  /* Example background color for own messages */
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  font-size: 16px;
}

.other-message-text {
  background-color: #a6c8ff;  /* Example background color for own messages */
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  font-size: 16px;
}
</style>