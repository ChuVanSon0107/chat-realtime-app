import React from 'react'

export const FriendTabs = ({ activeTab, setActiveTab }) => {

  return (
    <div>
      <button onClick={() => setActiveTab("friends")}>
        Bạn bè
      </button>
      <button onClick={() => setActiveTab("requests")}>
        Lời mời kết bạn
      </button>
      <button onClick={() => setActiveTab("search")}>
        Tìm kiếm bạn bè
      </button>
    </div>
  )
}
