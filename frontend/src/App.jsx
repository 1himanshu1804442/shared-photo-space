import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import EventDashboard from './components/EventDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/event/:joinCode" element={<EventDashboard />} />
    </Routes>
  )
}

export default App
