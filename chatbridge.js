/**
 * ChatBridge — Interactive messaging demo
 * Simulates conversations with E2E encryption, file sharing, video calling
 */
(function () {
    // ====== DATA ======
    var conversations = [
        {
            id: 'alice', name: 'Alice', initials: 'AL', color: 'cb-avatar-green',
            status: 'Online', unread: 2,
            messages: [
                { from: 'them', text: 'Hey Darsheel! Have you seen the new API update?', time: '10:30 AM' },
                { from: 'me', text: 'Yes! The rate limiting feature looks really solid.', time: '10:32 AM' },
                { from: 'them', text: 'Right? We should integrate it into our project.', time: '10:33 AM' },
                { from: 'me', text: 'Absolutely. Let me set up a branch for that today.', time: '10:35 AM' },
                { from: 'them', text: 'Perfect! I\'ll prepare the documentation.', time: '10:36 AM' },
                { from: 'them', text: 'Also, can you review my PR when you get a chance?', time: '10:38 AM' }
            ]
        },
        {
            id: 'bob', name: 'Bob Chen', initials: 'BC', color: 'cb-avatar-blue',
            status: 'Online', unread: 0,
            messages: [
                { from: 'me', text: 'Hey Bob, how\'s the deployment going?', time: '9:15 AM' },
                { from: 'them', text: 'All green! Zero downtime.', time: '9:18 AM' },
                { from: 'me', text: 'That\'s great news 🎉', time: '9:19 AM' },
                { from: 'them', text: 'The new CI pipeline saved us so much time.', time: '9:21 AM' }
            ]
        },
        {
            id: 'team', name: 'Team Dev', initials: 'TD', color: 'cb-avatar-pink',
            status: '5 members', unread: 5,
            messages: [
                { from: 'them', text: 'Sprint planning at 3 PM today.', time: 'Yesterday' },
                { from: 'me', text: 'I\'ll be there! Should I prepare the demo?', time: 'Yesterday' },
                { from: 'them', text: 'Yes please, show the ChatBridge progress.', time: 'Yesterday' },
                { from: 'me', text: 'Will do. I\'ll share my screen.', time: 'Yesterday' },
                { from: 'them', text: 'Don\'t forget to update the board before the meeting.', time: 'Today' }
            ]
        },
        {
            id: 'sarah', name: 'Sarah Kim', initials: 'SK', color: 'cb-avatar-orange',
            status: 'Last seen 2h ago', unread: 0,
            messages: [
                { from: 'them', text: 'The design mockups are ready for review.', time: '2:00 PM' },
                { from: 'me', text: 'They look amazing! Love the dark theme.', time: '2:15 PM' },
                { from: 'them', text: 'Thanks! I focused on accessibility this time.', time: '2:17 PM' }
            ]
        },
        {
            id: 'mike', name: 'Mike R.', initials: 'MR', color: 'cb-avatar-cyan',
            status: 'Offline', unread: 0,
            messages: [
                { from: 'me', text: 'Can you send me the test results?', time: 'Mon' },
                { from: 'them', text: 'Sure, attached the report.', time: 'Mon', file: { name: 'test_report.pdf', size: '2.4 MB' } },
                { from: 'me', text: 'Got it. Everything looks clean!', time: 'Mon' }
            ]
        }
    ];

    var activeConv = null;
    var callTimerInterval = null;
    var callSeconds = 0;

    // ====== DOM REFS ======
    var convList = document.getElementById('cb-conversations');
    var welcome = document.getElementById('cb-welcome');
    var chatView = document.getElementById('cb-chat');
    var messagesEl = document.getElementById('cb-messages');
    var msgInput = document.getElementById('cb-message-input');
    var btnSend = document.getElementById('btn-send');
    var chatUserName = document.getElementById('chat-user-name');
    var chatUserStatus = document.getElementById('chat-user-status');
    var chatAvatar = document.getElementById('chat-avatar');
    var searchInput = document.getElementById('cb-search');
    var videoModal = document.getElementById('cb-video-modal');
    var fileModal = document.getElementById('cb-file-modal');

    // ====== RENDER CONVERSATIONS ======
    function renderConversations(filter) {
        convList.innerHTML = '';
        var f = (filter || '').toLowerCase();
        conversations.forEach(function (c) {
            if (f && c.name.toLowerCase().indexOf(f) === -1) return;
            var lastMsg = c.messages[c.messages.length - 1];
            var div = document.createElement('div');
            div.className = 'cb-conv' + (activeConv && activeConv.id === c.id ? ' active' : '');
            div.innerHTML =
                '<div class="cb-avatar ' + c.color + '">' + c.initials + '</div>' +
                '<div class="cb-conv-info">' +
                '  <div class="cb-conv-top">' +
                '    <span class="cb-conv-name">' + c.name + '</span>' +
                '    <span class="cb-conv-time">' + lastMsg.time + '</span>' +
                '  </div>' +
                '  <div class="cb-conv-preview">' + (lastMsg.from === 'me' ? 'You: ' : '') + lastMsg.text.substring(0, 40) + '</div>' +
                '</div>' +
                (c.unread > 0 ? '<div class="cb-conv-unread">' + c.unread + '</div>' : '');
            div.addEventListener('click', function () { openChat(c); });
            convList.appendChild(div);
        });
    }

    // ====== OPEN CHAT ======
    function openChat(conv) {
        activeConv = conv;
        conv.unread = 0;
        welcome.style.display = 'none';
        chatView.style.display = 'flex';
        chatUserName.textContent = conv.name;
        chatAvatar.textContent = conv.initials;
        chatAvatar.className = 'cb-avatar ' + conv.color;

        var isOnline = conv.status === 'Online';
        chatUserStatus.innerHTML = (isOnline ? '<span class="cb-online-dot"></span> ' : '') + conv.status;
        chatUserStatus.style.color = isOnline ? '' : 'var(--cb-fg-faint)';

        // Update video modal
        document.getElementById('video-remote-avatar').textContent = conv.initials;
        document.getElementById('video-remote-avatar').className = 'cb-avatar cb-avatar-lg ' + conv.color;
        document.getElementById('video-remote-name').textContent = conv.name;
        document.getElementById('video-call-name').textContent = 'Call with ' + conv.name;

        renderMessages(conv);
        renderConversations();

        // On mobile, hide sidebar
        var sidebar = document.getElementById('cb-sidebar');
        if (window.innerWidth <= 768) sidebar.classList.add('hidden');
    }

    // ====== RENDER MESSAGES ======
    function renderMessages(conv) {
        messagesEl.innerHTML = '';
        // Date separator
        var sep = document.createElement('div');
        sep.className = 'cb-date-sep';
        sep.textContent = 'Today';
        messagesEl.appendChild(sep);

        conv.messages.forEach(function (msg, i) {
            var div = document.createElement('div');
            div.className = 'cb-msg ' + (msg.from === 'me' ? 'cb-msg-sent' : 'cb-msg-received');
            div.style.animationDelay = (i * 0.05) + 's';
            var html = msg.text;
            if (msg.file) {
                html += '<div class="cb-msg-file">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>' +
                    msg.file.name + ' <span style="opacity:0.5">(' + msg.file.size + ')</span></div>';
            }
            html += '<span class="cb-msg-time">' + msg.time + '</span>';
            div.innerHTML = html;
            messagesEl.appendChild(div);
        });

        // Scroll to bottom
        setTimeout(function () {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 50);
    }

    // ====== SEND MESSAGE ======
    function sendMessage() {
        var text = msgInput.value.trim();
        if (!text || !activeConv) return;

        var now = new Date();
        var timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        activeConv.messages.push({ from: 'me', text: text, time: timeStr });
        msgInput.value = '';
        renderMessages(activeConv);
        renderConversations();

        // Simulate reply after delay
        setTimeout(function () {
            simulateReply(activeConv);
        }, 1500 + Math.random() * 2000);
    }

    // ====== SIMULATE REPLY ======
    var replies = [
        'That sounds great! Let me check.',
        'I\'ll get back to you on that.',
        'Interesting approach! 🤔',
        'Let\'s discuss this in our next meeting.',
        'I agree, that\'s the way to go!',
        'Can you share more details?',
        'Perfect, I\'ll handle that.',
        'Noted! I\'ll update the docs.',
        'Thanks for the heads up! 👍',
        'On it! Give me a moment.'
    ];

    function simulateReply(conv) {
        if (conv !== activeConv) return;

        // Show typing indicator
        var typing = document.createElement('div');
        typing.className = 'cb-typing';
        typing.innerHTML = '<div class="cb-typing-dot"></div><div class="cb-typing-dot"></div><div class="cb-typing-dot"></div>';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        setTimeout(function () {
            if (typing.parentNode) typing.parentNode.removeChild(typing);
            var now = new Date();
            var timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            var reply = replies[Math.floor(Math.random() * replies.length)];
            conv.messages.push({ from: 'them', text: reply, time: timeStr });
            renderMessages(conv);
            renderConversations();
        }, 1200 + Math.random() * 1000);
    }

    // ====== VIDEO CALL ======
    function openVideoCall() {
        if (!activeConv) return;
        videoModal.style.display = 'flex';
        callSeconds = 0;
        updateCallTimer();
        callTimerInterval = setInterval(function () {
            callSeconds++;
            updateCallTimer();
        }, 1000);
    }

    function updateCallTimer() {
        var m = String(Math.floor(callSeconds / 60)).padStart(2, '0');
        var s = String(callSeconds % 60).padStart(2, '0');
        document.getElementById('call-timer').textContent = m + ':' + s;
    }

    function closeVideoCall() {
        videoModal.style.display = 'none';
        clearInterval(callTimerInterval);
    }

    // ====== FILE SHARING ======
    function openFileModal() {
        if (!activeConv) return;
        fileModal.style.display = 'flex';
        document.getElementById('btn-send-file').disabled = true;
    }

    function closeFileModal() {
        fileModal.style.display = 'none';
    }

    // ====== EVENT LISTENERS ======
    btnSend.addEventListener('click', sendMessage);
    msgInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    searchInput.addEventListener('input', function () {
        renderConversations(searchInput.value);
    });

    document.getElementById('btn-video-call').addEventListener('click', openVideoCall);
    document.getElementById('btn-end-call').addEventListener('click', closeVideoCall);
    document.getElementById('btn-attach').addEventListener('click', openFileModal);
    document.getElementById('btn-close-file').addEventListener('click', closeFileModal);

    document.getElementById('file-input').addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            document.getElementById('btn-send-file').disabled = false;
        }
    });

    document.getElementById('btn-send-file').addEventListener('click', function () {
        var fileInput = document.getElementById('file-input');
        if (fileInput.files.length > 0 && activeConv) {
            var file = fileInput.files[0];
            var sizeStr = file.size < 1024 * 1024
                ? (file.size / 1024).toFixed(1) + ' KB'
                : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
            var now = new Date();
            var timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            activeConv.messages.push({
                from: 'me',
                text: 'Shared a file:',
                time: timeStr,
                file: { name: file.name, size: sizeStr }
            });
            renderMessages(activeConv);
            renderConversations();
            closeFileModal();
            fileInput.value = '';
        }
    });

    document.getElementById('btn-new-chat').addEventListener('click', function () {
        alert('In a full deployment, this would open a new conversation dialog with contact search.');
    });

    document.getElementById('btn-mobile-back').addEventListener('click', function () {
        var sidebar = document.getElementById('cb-sidebar');
        sidebar.classList.remove('hidden');
    });

    // Close modals on overlay click
    videoModal.addEventListener('click', function (e) {
        if (e.target === videoModal) closeVideoCall();
    });
    fileModal.addEventListener('click', function (e) {
        if (e.target === fileModal) closeFileModal();
    });

    // ====== INIT ======
    // Increment visit count for ChatBridge
    var cbCount = parseInt(localStorage.getItem('chatbridge_use_count') || '0', 10);
    localStorage.setItem('chatbridge_use_count', (cbCount + 1).toString());

    var currentTheme = localStorage.getItem('portfolio_theme') || 'dark';
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    }
    renderConversations();
})();
