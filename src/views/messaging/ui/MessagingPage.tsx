'use client'

import { Check, CheckCheck, Paperclip, Plus, Search, Send, Smile, Users, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MessageStatus = 'sent' | 'delivered' | 'read'

interface Message {
  id: string
  body: string
  sentAt: string
  isMine: boolean
  status?: MessageStatus
}

interface Conversation {
  id: string
  name: string
  initials: string
  avatarBg: string
  avatarColor: string
  lastMessage: string
  lastTime: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Pedro Ramirez',
    initials: 'PR',
    avatarBg: '#C8F0D8',
    avatarColor: '#3D8A5A',
    lastMessage: 'Perfecto, quedamos para el domingo entonces.',
    lastTime: '10:42 AM',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        body: 'Hola, queria consultarte sobre el servicio del domingo.',
        sentAt: '10:30 AM',
        isMine: false,
      },
      {
        id: 'm2',
        body: 'Claro, dime. Estoy disponible.',
        sentAt: '10:32 AM',
        isMine: true,
        status: 'read',
      },
      {
        id: 'm3',
        body: 'Necesitamos confirmar el horario de la Santa Cena. El pastor pregunta si podemos adelantarlo a las 9:30 AM.',
        sentAt: '10:35 AM',
        isMine: false,
      },
      {
        id: 'm4',
        body: 'Si, eso funciona bien. Le confirmare al pastor.',
        sentAt: '10:38 AM',
        isMine: true,
        status: 'read',
      },
      {
        id: 'm5',
        body: 'Perfecto, quedamos para el domingo entonces.',
        sentAt: '10:42 AM',
        isMine: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Maria Lopez',
    initials: 'ML',
    avatarBg: '#D6E8F5',
    avatarColor: '#5B8DB8',
    lastMessage: 'Ya envie el reporte al correo del concilio.',
    lastTime: '9:15 AM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        body: 'Buenos dias! Queria avisarte que el reporte financiero de Febrero ya esta listo.',
        sentAt: '9:00 AM',
        isMine: false,
      },
      {
        id: 'm2',
        body: 'Excelente! Por favor envialo al correo del concilio.',
        sentAt: '9:08 AM',
        isMine: true,
        status: 'read',
      },
      {
        id: 'm3',
        body: 'Ya envie el reporte al correo del concilio.',
        sentAt: '9:15 AM',
        isMine: false,
      },
    ],
  },
  {
    id: '3',
    name: 'Grupo: Pastores',
    initials: 'GP',
    avatarBg: '#E8E0F5',
    avatarColor: '#8B7CB8',
    lastMessage: 'La reunion del martes queda confirmada.',
    lastTime: 'Ayer',
    unreadCount: 5,
    isOnline: false,
    messages: [
      {
        id: 'm1',
        body: 'Hermanos, necesito confirmar la reunion del martes.',
        sentAt: 'Ayer 3:00 PM',
        isMine: true,
        status: 'read',
      },
      {
        id: 'm2',
        body: 'Confirmado de nuestra parte.',
        sentAt: 'Ayer 3:15 PM',
        isMine: false,
      },
      {
        id: 'm3',
        body: 'Tambien confirmamos.',
        sentAt: 'Ayer 3:20 PM',
        isMine: false,
      },
      {
        id: 'm4',
        body: 'La reunion del martes queda confirmada.',
        sentAt: 'Ayer 4:00 PM',
        isMine: false,
      },
    ],
  },
  {
    id: '4',
    name: 'Ana Garcia',
    initials: 'AG',
    avatarBg: '#FDE8D8',
    avatarColor: '#D89575',
    lastMessage: 'Gracias por aprobar mi solicitud de traslado.',
    lastTime: 'Ayer',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm1',
        body: 'Buenas tardes, queria saber el estado de mi solicitud de traslado.',
        sentAt: 'Ayer 11:00 AM',
        isMine: false,
      },
      {
        id: 'm2',
        body: 'Tu solicitud fue aprobada. El traslado a Iglesia Emanuel es efectivo el proximo mes.',
        sentAt: 'Ayer 11:30 AM',
        isMine: true,
        status: 'read',
      },
      {
        id: 'm3',
        body: 'Gracias por aprobar mi solicitud de traslado.',
        sentAt: 'Ayer 11:35 AM',
        isMine: false,
      },
    ],
  },
  {
    id: '5',
    name: 'Roberto Mendez',
    initials: 'RM',
    avatarBg: '#C8F0D8',
    avatarColor: '#3D8A5A',
    lastMessage: 'El aporte de este mes ya fue registrado.',
    lastTime: 'Lun',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm1',
        body: 'El aporte de este mes ya fue registrado.',
        sentAt: 'Lun 2:00 PM',
        isMine: false,
      },
    ],
  },
]

const MOCK_MEMBERS = [
  { id: 'u1', name: 'Pedro Ramirez', initials: 'PR', avatarBg: '#C8F0D8', avatarColor: '#3D8A5A' },
  { id: 'u2', name: 'Maria Lopez', initials: 'ML', avatarBg: '#D6E8F5', avatarColor: '#5B8DB8' },
  { id: 'u3', name: 'Ana Garcia', initials: 'AG', avatarBg: '#FDE8D8', avatarColor: '#D89575' },
  { id: 'u4', name: 'Roberto Mendez', initials: 'RM', avatarBg: '#C8F0D8', avatarColor: '#3D8A5A' },
  { id: 'u5', name: 'Carlos Fuentes', initials: 'CF', avatarBg: '#E8E0F5', avatarColor: '#8B7CB8' },
  { id: 'u6', name: 'Laura Castillo', initials: 'LC', avatarBg: '#FDE8D8', avatarColor: '#D89575' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  if (status === 'read') return <CheckCheck className="size-3.5 text-[#5B8DB8]" />
  if (status === 'delivered') return <CheckCheck className="size-3.5 text-[#9C9B99]" />
  return <Check className="size-3.5 text-[#9C9B99]" />
}

// ---------------------------------------------------------------------------
// Conversation list item
// ---------------------------------------------------------------------------

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
}

function ConversationItem({ conversation, isActive, onSelect }: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors',
        isActive ? 'bg-[#F0FAF4]' : 'hover:bg-[#FAFAF8]',
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="flex size-10 items-center justify-center rounded-full text-[13px] font-semibold"
          style={{ backgroundColor: conversation.avatarBg, color: conversation.avatarColor }}
        >
          {conversation.initials}
        </div>
        {conversation.isOnline && (
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#3D8A5A] ring-2 ring-white" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p
            className={cn(
              'truncate text-[13px]',
              conversation.unreadCount > 0
                ? 'font-semibold text-[#1A1918]'
                : 'font-medium text-[#1A1918]',
            )}
          >
            {conversation.name}
          </p>
          <span
            className={cn(
              'shrink-0 text-[11px]',
              conversation.unreadCount > 0 ? 'font-semibold text-[#3D8A5A]' : 'text-[#9C9B99]',
            )}
          >
            {conversation.lastTime}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <p
            className={cn(
              'truncate text-[12px]',
              conversation.unreadCount > 0 ? 'text-[#1A1918]' : 'text-[#9C9B99]',
            )}
          >
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3D8A5A] text-[10px] font-bold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Chat bubble
// ---------------------------------------------------------------------------

interface ChatBubbleProps {
  message: Message
}

function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <div className={cn('flex w-full', message.isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[72%] rounded-2xl px-4 py-2.5',
          message.isMine
            ? 'rounded-br-sm bg-[#3D8A5A] text-white'
            : 'rounded-bl-sm bg-white text-[#1A1918] shadow-[0_1px_4px_rgba(26,25,24,0.08)]',
        )}
      >
        <p
          className={cn(
            'text-[13px] leading-relaxed',
            message.isMine ? 'text-white' : 'text-[#1A1918]',
          )}
        >
          {message.body}
        </p>
        <div
          className={cn(
            'mt-1 flex items-center gap-1',
            message.isMine ? 'justify-end' : 'justify-start',
          )}
        >
          <span className={cn('text-[10px]', message.isMine ? 'text-white/70' : 'text-[#9C9B99]')}>
            {message.sentAt}
          </span>
          {message.isMine && message.status && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Chat view panel
// ---------------------------------------------------------------------------

interface ChatViewProps {
  conversation: Conversation
  onSend: (conversationId: string, text: string) => void
}

function ChatView({ conversation, onSend }: ChatViewProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  function handleSend() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onSend(conversation.id, trimmed)
    setInputValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-[#E5E4E1] px-5 py-3.5">
        <div className="relative shrink-0">
          <div
            className="flex size-9 items-center justify-center rounded-full text-[12px] font-semibold"
            style={{
              backgroundColor: conversation.avatarBg,
              color: conversation.avatarColor,
            }}
          >
            {conversation.initials}
          </div>
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#3D8A5A] ring-2 ring-white" />
          )}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#1A1918]">{conversation.name}</p>
          <p className="text-[11px] text-[#9C9B99]">
            {conversation.isOnline ? 'En linea' : 'Desconectado'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#F5F4F1] px-5 py-4">
        {conversation.messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#E5E4E1] bg-white px-4 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
          <button
            type="button"
            className="shrink-0 text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
            aria-label="Adjuntar archivo"
          >
            <Paperclip className="size-4.5" />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
            style={{ maxHeight: '120px' }}
          />
          <button
            type="button"
            className="shrink-0 text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
            aria-label="Emoji"
          >
            <Smile className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors',
              inputValue.trim()
                ? 'bg-[#3D8A5A] text-white hover:bg-[#336b49]'
                : 'bg-[#E5E4E1] text-[#9C9B99]',
            )}
            aria-label="Enviar mensaje"
          >
            <Send className="size-4" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[#9C9B99]">
          Presiona Enter para enviar, Shift+Enter para nueva linea
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Empty state for when no conversation is selected
// ---------------------------------------------------------------------------

function NoConversationSelected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#F5F4F1]">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
        <Send className="size-7 text-[#9C9B99]" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-[#1A1918]">Selecciona una conversacion</p>
        <p className="mt-1 text-[12px] text-[#9C9B99]">
          Elige un contacto para ver el historial de mensajes
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Create Group Modal
// ---------------------------------------------------------------------------

interface CreateGroupModalProps {
  onClose: () => void
  onConfirm: (name: string, memberIds: string[]) => void
}

function CreateGroupModal({ onClose, onConfirm }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  function toggleMember(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const canCreate = groupName.trim().length > 0 && selectedIds.length >= 2

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E4E1] px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-[#3D8A5A]" />
            <h2 className="text-[15px] font-semibold text-[#1A1918]">Crear Grupo</h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] hover:bg-[#F5F4F1] hover:text-[#1A1918] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Group name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6D6C6A]">Nombre del Grupo</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ej. Pastores del Concilio"
              className="rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2.5 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] focus:border-[#3D8A5A] focus:bg-white transition-colors"
            />
          </div>

          {/* Members */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-[#6D6C6A]">Agregar Miembros</label>
              <span className="text-[11px] text-[#9C9B99]">{selectedIds.length} seleccionados</span>
            </div>
            <div className="flex flex-col divide-y divide-[#E5E4E1] rounded-xl border border-[#E5E4E1] overflow-hidden max-h-[220px] overflow-y-auto">
              {MOCK_MEMBERS.map((member) => {
                const selected = selectedIds.includes(member.id)
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                      selected ? 'bg-[#F0FAF4]' : 'bg-white hover:bg-[#FAFAF8]',
                    )}
                  >
                    <div
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: member.avatarBg, color: member.avatarColor }}
                    >
                      {member.initials}
                    </div>
                    <p className="flex-1 text-[13px] font-medium text-[#1A1918]">{member.name}</p>
                    <div
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        selected ? 'border-[#3D8A5A] bg-[#3D8A5A]' : 'border-[#E5E4E1] bg-white',
                      )}
                    >
                      {selected && <Check className="size-3 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
            {selectedIds.length < 2 && (
              <p className="text-[11px] text-[#9C9B99]">Selecciona al menos 2 miembros</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E5E4E1] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E5E4E1] px-4 py-2 text-[13px] font-medium text-[#6D6C6A] hover:bg-[#F5F4F1] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => canCreate && onConfirm(groupName.trim(), selectedIds)}
            disabled={!canCreate}
            className={cn(
              'rounded-xl px-4 py-2 text-[13px] font-medium text-white transition-colors',
              canCreate
                ? 'bg-[#3D8A5A] hover:bg-[#336b49]'
                : 'bg-[#E5E4E1] text-[#9C9B99] cursor-not-allowed',
            )}
          >
            Crear Grupo
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS)
  const [activeId, setActiveId] = useState<string | null>('1')
  const [searchValue, setSearchValue] = useState('')
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchValue.toLowerCase()),
  )

  function handleSend(conversationId: string, text: string) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c
        const newMessage: Message = {
          id: `m${Date.now()}`,
          body: text,
          sentAt: new Date().toLocaleTimeString('es-HN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isMine: true,
          status: 'sent',
        }
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: text,
          lastTime: newMessage.sentAt,
        }
      }),
    )
  }

  function handleCreateGroup(name: string, memberIds: string[]) {
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
    const newGroup: Conversation = {
      id: `g${Date.now()}`,
      name: `Grupo: ${name}`,
      initials,
      avatarBg: '#E8E0F5',
      avatarColor: '#8B7CB8',
      lastMessage: 'Grupo creado',
      lastTime: 'Ahora',
      unreadCount: 0,
      isOnline: false,
      messages: [],
    }
    setConversations((prev) => [newGroup, ...prev])
    setActiveId(newGroup.id)
    setShowCreateGroup(false)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title="Mensajeria" subtitle="Comunicacion interna del concilio" />

      <div className="flex flex-1 gap-0 overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
        <div className="flex flex-1 overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Left panel: conversation list */}
          <div
            className={cn(
              'flex w-full flex-col border-r border-[#E5E4E1] lg:w-[320px] lg:shrink-0',
              activeId !== null && 'hidden lg:flex',
            )}
          >
            {/* Search */}
            <div className="border-b border-[#E5E4E1] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2">
                  <Search className="size-3.5 shrink-0 text-[#9C9B99]" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Buscar conversacion..."
                    className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(true)}
                  title="Nuevo Grupo"
                  className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#3D8A5A] text-white hover:bg-[#336b49] transition-colors"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E5E4E1]">
              {filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeId === conv.id}
                  onSelect={() => setActiveId(conv.id)}
                />
              ))}
              {filteredConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <p className="text-[13px] text-[#9C9B99]">Sin resultados</p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: chat view */}
          <div
            className={cn(
              'flex flex-1 flex-col overflow-hidden',
              activeId === null && 'hidden lg:flex',
            )}
          >
            {activeConversation ? (
              <ChatView conversation={activeConversation} onSend={handleSend} />
            ) : (
              <NoConversationSelected />
            )}
          </div>
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} onConfirm={handleCreateGroup} />
      )}
    </div>
  )
}
