import MyKanbanBoard from '@/components/custom_kanban'
import React from 'react'

function MemberDashboard() {
  return (
    <div>
      Member Dashboard Here
      <MyKanbanBoard role={false} projectId={1} />
    </div>
  )
}

export default MemberDashboard
