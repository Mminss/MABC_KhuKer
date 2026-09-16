// 초기 채팅방 데이터
// 각 플랫폼에 이미 같은 공지가 올려져 있음 (단, 일부 플랫폼은 값이 다름 - 충돌 포인트)
const chatData = {
  slack: {
    title: '동아리 하반기 행사',
    items: {
      date: '9월 20일(토)',
      time: '14:00~17:00',
      place: '본관 3층 강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 15일(월) 18시'
    },
    messages: [
      { sender: '시스템', time: '지금', content: '슬랙 채널이 준비되었습니다.' },
      { sender: '회장', time: '오전 10:00', content: '이번 주 토요일에 행사 있죠?' },
      { sender: '부회장', time: '오전 10:01', content: '넵 맞습니다! 9월 20일이요!' },
      { sender: '총무', time: '오전 10:02', content: '참가비 5,000원 준비해야겠네요' }
    ]
  },
  kakao: {
    title: '동아리 하반기 행사',
    items: {
      date: '9월 20일(토)',
      time: '14:00~17:00',
      place: '본관 3층 강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 15일(월) 18시'
    },
    messages: [
      { sender: '시스템', time: '지금', content: '카카오톡방이 준비되었습니다.' },
      { sender: '회장', time: '오전 9:30', content: '행사 공지 다들 보셨나요?' },
      { sender: '임원A', time: '오전 9:31', content: '네 봤습니다! 9월 20일 토요일!' },
      { sender: '임원B', time: '오전 9:32', content: '참가비 5,000원이었군요' }
    ]
  },
  insta: {
    title: '동아리 하반기 행사',
    items: {
      date: '9월 20일(토)',
      time: '14시~17시',
      place: '본관 3층 강당',
      fee: '3,000원',
      link: 'bit.ly/apply-x9z2',
      deadline: '9월 15일(월) 18시'
    },
    messages: [
      { sender: '시스템', time: '지금', content: '인스타그램 계정이 준비되었습니다.' },
      { sender: '인스타관리자', time: '오후 4:00', content: '인스타 공지 올렸습니다! 참가비 3,000원으로 공지했어요' }
    ]
  },
  form: {
    title: '동아리 하반기 행사',
    items: {
      date: '2025년 9월 21일(일)',
      time: '14:00~17:00',
      place: '본관 3층 대강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 16일(화) 18:00'
    },
    messages: [
      { sender: '시스템', time: '지금', content: '신청폼이 준비되었습니다.' },
      { sender: '폼관리자', time: '오후 2:00', content: '신청폼에 행사 정보 등록 완료했습니다' }
    ]
  },
  telegram: {
    title: '동아리 하반기 행사',
    items: {
      date: '9월 20일(토)',
      time: '14:00~17:00',
      place: '본관 3층 강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 15일(월) 18시'
    },
    messages: [
      { sender: '시스템', time: '지금', content: '텔레그램 채널이 준비되었습니다.' },
      { sender: '회원1', time: '오후 2:00', content: '행사 공지 확인했습니다!' },
      { sender: '운영진', time: '오후 2:01', content: '네! 9월 20일 토요일이에요' }
    ]
  },
  noticeboard: {
    title: '동아리 하반기 행사 (2025)',
    items: {
      date: '9월 20일(토)',
      time: '14:00~17:00',
      place: '본관 3층 강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 15일(월) 18시'
    },
    messages: [
      { sender: '시스템', time: '지금', content: '공지판 게시판이 준비되었습니다.' },
      { sender: '관리자', time: '오전 9:00', content: '행사 공지 게시 완료했습니다' }
    ]
  }
};

// 현재 상태
let currentChatData = JSON.parse(JSON.stringify(chatData));
let noticeLog = [];
let conflictData = null;

// DOM 요소
const submitNoticeBtn = document.getElementById('submitNoticeBtn');
const noticeTitleInput = document.getElementById('noticeTitle');
const noticeDateInput = document.getElementById('noticeDate');
const noticeTimeInput = document.getElementById('noticeTime');
const noticePlaceInput = document.getElementById('noticePlace');
const noticeFeeInput = document.getElementById('noticeFee');
const noticeLinkInput = document.getElementById('noticeLink');
const noticeDeadlineInput = document.getElementById('noticeDeadline');
const logListEl = document.getElementById('logList');
const conflictModal = document.getElementById('conflictModal');
const modalBody = document.getElementById('modalBody');
const modalMismatchList = document.getElementById('modalMismatchList');
const mismatchCountDisplay = document.getElementById('mismatchCountDisplay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalViewDetailsBtn = document.getElementById('modalViewDetailsBtn');
const modalApplyAllBtn = document.getElementById('modalApplyAllBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const detailsModal = document.getElementById('detailsModal');
const detailsContent = document.getElementById('detailsContent');
const detailsCloseBtn = document.getElementById('detailsCloseBtn');
const detailsBackToConflictBtn = document.getElementById('detailsBackToConflictBtn');
const detailsApplyAllBtn = document.getElementById('detailsApplyAllBtn');
const detailsCancelBtn = document.getElementById('detailsCancelBtn');

// 채팅방 렌더링
function renderChatRoom(channelKey, roomEl) {
  const data = currentChatData[channelKey];
  const badgeColors = {
    slack: '#3498db',
    kakao: '#25D366',
    insta: '#E1306C',
    form: '#f39c12',
    telegram: '#0088cc',
    noticeboard: '#95a5a6'
  };

  const channelNames = {
    slack: '슬랙',
    kakao: '카톡',
    insta: '인스타',
    form: '신청폼',
    telegram: '텔레그램',
    noticeboard: '공지판'
  };

  const chatTitles = {
    slack: '#동아리-공지',
    kakao: '동아리방',
    insta: '@동아리-계정',
    form: '행사 신청서',
    telegram: '@동아리-알림',
    noticeboard: '행사 게시판'
  };

  const summaryHtml = `
    <div class="notice-summary">
      <strong>${data.title}</strong>
      <span class="summary-items">
        📅 ${data.items.date} | ⏰ ${data.items.time} | 📍 ${data.items.place} | 💰 ${data.items.fee}
      </span>
    </div>
  `;

  const messagesHtml = data.messages.map(msg => {
    const isSystem = msg.sender === '시스템';
    const msgClass = isSystem ? 'system-message' : 'user-message';
    return `
      <div class="message ${msgClass}">
        <span class="message-sender">${msg.sender}</span>
        <span class="message-time">${msg.time}</span>
        <p class="message-content">${msg.content}</p>
      </div>
    `;
  }).join('');

  roomEl.innerHTML = `
    <div class="chat-header">
      <span class="channel-badge" style="background: ${badgeColors[channelKey]}">${channelNames[channelKey]}</span>
      <span class="chat-title">${chatTitles[channelKey]}</span>
    </div>
    ${summaryHtml}
    <div class="chat-messages">
      ${messagesHtml}
    </div>
  `;
}

function renderAllChatRooms() {
  const channelKeys = ['slack', 'kakao', 'insta', 'form', 'telegram', 'noticeboard'];
  const roomEls = {
    slack: document.getElementById('chat-slack'),
    kakao: document.getElementById('chat-kakao'),
    insta: document.getElementById('chat-insta'),
    form: document.getElementById('chat-form'),
    telegram: document.getElementById('chat-telegram'),
    noticeboard: document.getElementById('chat-noticeboard')
  };

  channelKeys.forEach(key => {
    renderChatRoom(key, roomEls[key]);
  });
}

function renderNoticeLog() {
  logListEl.innerHTML = noticeLog.map(log => `
    <li>
      <span>${log.title}</span>
      <span class="log-time">${log.time}</span>
    </li>
  `).join('');
}

submitNoticeBtn.addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('.platform-checkboxes input[type="checkbox"]:checked');
  const selectedPlatforms = Array.from(checkboxes).map(cb => cb.value);

  if (selectedPlatforms.length === 0) {
    alert('게시할 플랫폼을 하나 이상 선택해주세요.');
    return;
  }

  const newNotice = {
    title: noticeTitleInput.value.trim() || '동아리 하반기 행사',
    items: {
      date: noticeDateInput.value.trim() || '9월 20일(토)',
      time: noticeTimeInput.value.trim() || '14:00~17:00',
      place: noticePlaceInput.value.trim() || '본관 3층 강당',
      fee: noticeFeeInput.value.trim() || '5,000원',
      link: noticeLinkInput.value.trim() || 'https://apply.example.com/x9z2',
      deadline: noticeDeadlineInput.value.trim() || '9월 15일(월) 18시'
    },
    platforms: selectedPlatforms,
    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  };

  noticeLog.unshift({
    title: newNotice.title,
    time: newNotice.time,
    platforms: selectedPlatforms,
    items: newNotice.items
  });

  renderNoticeLog();

  selectedPlatforms.forEach(platform => {
    if (currentChatData[platform]) {
      currentChatData[platform].title = newNotice.title;
      currentChatData[platform].items = newNotice.items;
      currentChatData[platform].messages = [
        { sender: '시스템', time: newNotice.time, content: `【공지】 ${newNotice.title}` },
        { sender: '시스템', time: newNotice.time, content: `📅 ${newNotice.items.date} ${newNotice.items.time}` },
        { sender: '시스템', time: newNotice.time, content: `📍 ${newNotice.items.place}` },
        { sender: '시스템', time: newNotice.time, content: `💰 ${newNotice.items.fee}` },
        { sender: '시스템', time: newNotice.time, content: `🔗 ${newNotice.items.link}` },
        { sender: '시스템', time: newNotice.time, content: `⏰ 마감: ${newNotice.items.deadline}` },
        { sender: '운영진', time: newNotice.time, content: '다들 확인 부탁드립니다!' }
      ];
    }
  });

  renderAllChatRooms();

  setTimeout(() => {
    detectConflicts(newNotice.items, selectedPlatforms);
  }, 300);
});

function detectConflicts(slackItems, selectedPlatforms) {
  const channels = selectedPlatforms.filter(p => p !== 'slack');
  const mismatchItems = [];
  const totalItems = Object.keys(slackItems).length;

  let mismatchCount = 0;

  for (const [key, slackValue] of Object.entries(slackItems)) {
    const label = key === 'fee' ? '참가비' :
                  key === 'link' ? '신청 링크' :
                  key === 'deadline' ? '마감일' :
                  key === 'date' ? '날짜' :
                  key === 'time' ? '시간' :
                  key.charAt(0).toUpperCase() + key.slice(1);

    const otherValues = channels.map(channel => ({
      channel: channel,
      channelName: channel === 'kakao' ? '카톡' :
                    channel === 'insta' ? '인스타' :
                    channel === 'form' ? '신청폼' :
                    channel === 'telegram' ? '텔레그램' : '공지판',
      value: currentChatData[channel].items[key]
    }));

    const allSame = otherValues.every(v => v.value === slackValue);
    const someDifferent = otherValues.some(v => v.value !== slackValue);

    if (allSame) {
      continue;
    }

    if (someDifferent) {
      mismatchCount++;
      const differentChannels = otherValues.filter(v => v.value !== slackValue);
      const sameChannels = otherValues.filter(v => v.value === slackValue);

      mismatchItems.push({
        key,
        label,
        slackValue,
        otherValues,
        status: '어긋남',
        differentChannels,
        sameChannels,
        excerpt: `슬랙 - ${label}: "${slackValue}"`
      });
    }
  }

  conflictData = {
    totalItems,
    mismatchCount,
    channelCount: channels.length + 1,
    mismatchItems,
    selectedPlatforms
  };

  showConflictModal();
}

function showConflictModal() {
  mismatchCountDisplay.textContent = conflictData.mismatchCount;

  modalBody.innerHTML = `
    <p class="modal-warning">
      🚨 공지를 올리는 과정에서 다른 플랫폼과 차이가 발견되었습니다.
    </p>
    <div class="modal-stats">
      <div class="stat-card">
        <span class="stat-number">${conflictData.totalItems}</span>
        <span class="stat-label">탐지 항목</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${conflictData.mismatchCount}</span>
        <span class="stat-label">어긋난 항목</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${conflictData.channelCount}</span>
        <span class="stat-label">채널</span>
      </div>
    </div>
    <div class="modal-mismatch-list">
      ${conflictData.mismatchItems.slice(0, 3).map(item => `
        <div class="mismatch-item">
          <h4>❌ ${item.label}</h4>
          <div class="channel-values">
            <div><strong>슬랙:</strong> ${item.slackValue}</div>
            ${item.differentChannels.map(v => `
              <div class="different">${v.channelName}: ${v.value} ❌</div>
            `).join('')}
            ${item.sameChannels.map(v => `
              <div class="same">${v.channelName}: ${v.value} ✅</div>
            `).join('')}
          </div>
          <div class="source-excerpt">
            "${item.excerpt}"
          </div>
        </div>
      `).join('')}
    </div>
  `;

  conflictModal.classList.add('visible');
}

modalCloseBtn.addEventListener('click', () => {
  conflictModal.classList.remove('visible');
});

modalViewDetailsBtn.addEventListener('click', () => {
  conflictModal.classList.remove('visible');
  showDetailsModal();
});

modalApplyAllBtn.addEventListener('click', () => {
  applyAllModifications();
});

modalCancelBtn.addEventListener('click', () => {
  conflictModal.classList.remove('visible');
});

function showDetailsModal() {
  let detailsHtml = '';

  for (const item of conflictData.mismatchItems) {
    detailsHtml += `
      <div class="detail-item">
        <h4>
          ❌ ${item.label}
          <span class="status-badge">어긋남</span>
        </h4>
        <div class="channel-row">
          <span class="channel-name">슬랙</span>
          <span class="channel-value">${item.slackValue}</span>
        </div>
        ${item.otherValues.map(v => `
          <div class="channel-row">
            <span class="channel-name">${v.channelName}</span>
            <span class="channel-value ${v.value !== item.slackValue ? 'different' : ''}">
              ${v.value}
              ${v.value !== item.slackValue ? '❌' : '✅'}
            </span>
          </div>
        `).join('')}
        <div class="source-excerpt">
          "슬랙 - ${item.label}: ${item.slackValue}"
        </div>
      </div>
    `;
  }

  detailsContent.innerHTML = detailsHtml;
  detailsModal.classList.add('visible');
}

detailsCloseBtn.addEventListener('click', () => {
  detailsModal.classList.remove('visible');
});

detailsBackToConflictBtn.addEventListener('click', () => {
  detailsModal.classList.remove('visible');
  showConflictModal();
});

detailsApplyAllBtn.addEventListener('click', () => {
  detailsModal.classList.remove('visible');
  applyAllModifications();
});

detailsCancelBtn.addEventListener('click', () => {
  detailsModal.classList.remove('visible');
});

function applyAllModifications() {
  const modifiedItems = conflictData.mismatchItems.map(item => ({
    channel: item.otherValues[0].channel,
    channelName: item.otherValues[0].channelName,
    key: item.key,
    oldValue: item.otherValues[0].value,
    newValue: item.slackValue
  }));

  conflictData.selectedPlatforms.forEach(platform => {
    if (platform !== 'slack' && currentChatData[platform]) {
      for (const mod of modifiedItems) {
        if (mod.channel === platform) {
          currentChatData[platform].items[mod.key] = mod.newValue;
        }
      }
    }
  });

  conflictData.selectedPlatforms.forEach(platform => {
    if (platform !== 'slack' && currentChatData[platform]) {
      const data = currentChatData[platform];
      const messages = [
        { sender: '시스템', time: '지금', content: `【자동 수정】 ${data.title}` },
        { sender: '시스템', time: '지금', content: `📅 ${data.items.date} ${data.items.time}` },
        { sender: '시스템', time: '지금', content: `📍 ${data.items.place}` },
        { sender: '시스템', time: '지금', content: `💰 ${data.items.fee}` },
        { sender: '시스템', time: '지금', content: `🔗 ${data.items.link}` },
        { sender: '시스템', time: '지금', content: `⏰ 마감: ${data.items.deadline}` },
        { sender: '운영진', time: '지금', content: '공지 확인 완료!' }
      ];
      currentChatData[platform].messages = messages;
    }
  });

  renderAllChatRooms();

  alert('✅ 전체 수정 반영 완료!\n선택된 플랫폼의 공지가 슬랙 기준으로 업데이트되었습니다.');
  conflictModal.classList.remove('visible');
  detailsModal.classList.remove('visible');
}

renderAllChatRooms();
renderNoticeLog();
JSEOF