'use client'

import {
  ArrowLeft,
  Camera,
  Check,
  CheckCheck,
  FileText,
  Image,
  MessageSquarePlus,
  Mic,
  Paperclip,
  PenSquare,
  Play,
  Plus,
  Search,
  Send,
  Smile,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MessageStatus = 'sent' | 'delivered' | 'read'
type FilterTab = 'all' | 'unread' | 'favorites'

interface MessageAttachment {
  name: string
  kind: 'document' | 'image' | 'video' | 'audio'
  size: string
}

interface Message {
  id: string
  body: string
  sentAt: string
  isMine: boolean
  status?: MessageStatus
  attachment?: MessageAttachment
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
  isFavorite: boolean
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
    isFavorite: true,
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
    isFavorite: false,
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
    isFavorite: true,
    messages: [
      {
        id: 'm1',
        body: 'Hermanos, necesito confirmar la reunion del martes.',
        sentAt: 'Ayer 3:00 PM',
        isMine: true,
        status: 'read',
      },
      { id: 'm2', body: 'Confirmado de nuestra parte.', sentAt: 'Ayer 3:15 PM', isMine: false },
      { id: 'm3', body: 'Tambien confirmamos.', sentAt: 'Ayer 3:20 PM', isMine: false },
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
    isFavorite: false,
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
    isFavorite: false,
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

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'unread', label: 'Sin Leer' },
  { key: 'favorites', label: 'Favoritos' },
]

// Heights for the animated recording waveform (20 bars, varying heights in px)
const WAVE_HEIGHTS = [6, 14, 20, 10, 18, 8, 22, 12, 16, 6, 20, 10, 18, 8, 14, 22, 6, 16, 12, 20]

// Static waveform bars displayed inside audio note bubbles (30 bars)
const STATIC_WAVE = [
  4, 8, 14, 10, 18, 6, 20, 12, 16, 8, 4, 14, 10, 18, 6, 20, 12, 8, 16, 4, 14, 18, 8, 12, 6, 20, 10,
  16, 8, 4,
]

const EMOJI_GROUPS = [
  { label: 'Frecuentes', emojis: ['😀', '😂', '🥹', '😊', '😍', '🤩', '😎', '😢', '🙏', '❤️'] },
  { label: 'Gestos', emojis: ['👍', '👎', '👋', '✌️', '🤞', '🤝', '🙌', '👏', '🤜', '💪'] },
  { label: 'Expresiones', emojis: ['😅', '🤣', '😇', '🥰', '😘', '🤔', '😬', '😴', '🥳', '😤'] },
  { label: 'Simbolos', emojis: ['🔥', '✨', '⭐', '🎉', '💯', '🕊️', '📖', '⛪', '🌿', '🙌'] },
]

interface FileCategory {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string; color?: string }>
  accept: string
  capture?: string
  bg: string
  color: string
  kind: MessageAttachment['kind']
}

const FILE_CATEGORIES: FileCategory[] = [
  {
    id: 'document',
    label: 'Documentos',
    icon: FileText,
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
    bg: '#FEF3E2',
    color: '#D97706',
    kind: 'document',
  },
  {
    id: 'media',
    label: 'Fotos y Videos',
    icon: Image,
    accept: 'image/*,video/*',
    bg: '#F0FAF4',
    color: '#3D8A5A',
    kind: 'image',
  },
  {
    id: 'camera',
    label: 'Camara',
    icon: Camera,
    accept: 'image/*',
    capture: 'environment',
    bg: '#EFF6FF',
    color: '#3B82F6',
    kind: 'image',
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: Mic,
    accept: 'audio/*',
    bg: '#F5F0FF',
    color: '#7C3AED',
    kind: 'audio',
  },
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
          <div className="flex shrink-0 items-center gap-1">
            {conversation.isFavorite && <Star className="size-3 fill-[#F5A623] text-[#F5A623]" />}
            <span
              className={cn(
                'text-[11px]',
                conversation.unreadCount > 0 ? 'font-semibold text-[#3D8A5A]' : 'text-[#9C9B99]',
              )}
            >
              {conversation.lastTime}
            </span>
          </div>
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

function AttachmentIcon({
  kind,
  className,
}: {
  kind: MessageAttachment['kind']
  className?: string
}) {
  if (kind === 'document') return <FileText className={className} />
  if (kind === 'audio') return <Mic className={className} />
  return <Image className={className} />
}

function ChatBubble({ message }: ChatBubbleProps) {
  const mine = message.isMine
  return (
    <div className={cn('flex w-full', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[72%] rounded-2xl px-4 py-2.5',
          mine
            ? 'rounded-br-sm bg-[#3D8A5A] text-white'
            : 'rounded-bl-sm bg-white text-[#1A1918] shadow-[0_1px_4px_rgba(26,25,24,0.08)]',
        )}
      >
        {/* Audio note player */}
        {message.attachment?.kind === 'audio' && (
          <div className="mb-2 flex items-center gap-3">
            <button
              type="button"
              aria-label="Reproducir"
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                mine ? 'bg-white/20 hover:bg-white/30' : 'bg-[#3D8A5A] hover:bg-[#336b49]',
              )}
            >
              <Play className={cn('size-4', mine ? 'text-white' : 'text-white')} fill="white" />
            </button>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-end gap-[2px]">
                {STATIC_WAVE.map((h, i) => (
                  <div
                    key={i}
                    className={cn('w-[2px] rounded-full', mine ? 'bg-white/50' : 'bg-[#3D8A5A]/40')}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <span className={cn('text-[10px]', mine ? 'text-white/70' : 'text-[#9C9B99]')}>
                {message.attachment.size}
              </span>
            </div>
          </div>
        )}

        {/* Generic attachment chip (document / image / video) */}
        {message.attachment && message.attachment.kind !== 'audio' && (
          <div
            className={cn(
              'mb-2 flex items-center gap-2 rounded-xl px-3 py-2',
              mine ? 'bg-white/15' : 'bg-[#F5F4F1]',
            )}
          >
            <AttachmentIcon
              kind={message.attachment.kind}
              className={cn('size-4 shrink-0', mine ? 'text-white' : 'text-[#6D6C6A]')}
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'truncate text-[12px] font-medium',
                  mine ? 'text-white' : 'text-[#1A1918]',
                )}
              >
                {message.attachment.name}
              </p>
              <p className={cn('text-[10px]', mine ? 'text-white/70' : 'text-[#9C9B99]')}>
                {message.attachment.size}
              </p>
            </div>
          </div>
        )}
        {message.body && (
          <p className={cn('text-[13px] leading-relaxed', mine ? 'text-white' : 'text-[#1A1918]')}>
            {message.body}
          </p>
        )}
        <div className={cn('mt-1 flex items-center gap-1', mine ? 'justify-end' : 'justify-start')}>
          <span className={cn('text-[10px]', mine ? 'text-white/70' : 'text-[#9C9B99]')}>
            {message.sentAt}
          </span>
          {mine && message.status && <MessageStatusIcon status={message.status} />}
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
  onSend: (conversationId: string, text: string, attachment?: MessageAttachment) => void
  onToggleFavorite: (id: string) => void
  onBack: () => void
}

function formatRecordingTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function ChatView({ conversation, onSend, onToggleFavorite, onBack }: ChatViewProps) {
  const [inputValue, setInputValue] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showFilePicker, setShowFilePicker] = useState(false)
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const filePickerRef = useRef<HTMLDivElement>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  // Recording timer
  useEffect(() => {
    if (!isRecording) return
    const id = setInterval(() => setRecordingTime((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [isRecording])

  // Close pickers on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false)
      if (filePickerRef.current && !filePickerRef.current.contains(e.target as Node))
        setShowFilePicker(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.onstop = () => stream.getTracks().forEach((t) => t.stop())
      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setShowEmoji(false)
      setShowFilePicker(false)
    } catch {
      // microphone not available or permission denied
    }
  }

  function cancelRecording() {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    setRecordingTime(0)
  }

  function sendRecording() {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    const duration = formatRecordingTime(recordingTime)
    const attachment: MessageAttachment = {
      name: 'Nota de voz',
      kind: 'audio',
      size: duration,
    }
    onSend(conversation.id, '', attachment)
    setRecordingTime(0)
  }

  function insertEmoji(emoji: string) {
    const el = textareaRef.current
    if (!el) {
      setInputValue((v) => v + emoji)
      return
    }
    const start = el.selectionStart ?? inputValue.length
    const end = el.selectionEnd ?? inputValue.length
    const next = inputValue.slice(0, start) + emoji + inputValue.slice(end)
    setInputValue(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + emoji.length, start + emoji.length)
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, category: FileCategory) {
    const file = e.target.files?.[0]
    if (!file) return
    const kb = file.size / 1024
    const size = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`
    const kind: MessageAttachment['kind'] =
      category.kind === 'image' && file.type.startsWith('video') ? 'video' : category.kind
    setPendingAttachment({ name: file.name, kind, size })
    setShowFilePicker(false)
    e.target.value = ''
  }

  function handleSend() {
    const trimmed = inputValue.trim()
    if (!trimmed && !pendingAttachment) return
    onSend(conversation.id, trimmed, pendingAttachment ?? undefined)
    setInputValue('')
    setPendingAttachment(null)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = inputValue.trim().length > 0 || pendingAttachment !== null

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-[#E5E4E1] px-5 py-3.5">
        {/* Back button — mobile only */}
        <button
          type="button"
          onClick={onBack}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1] lg:hidden"
          aria-label="Volver"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="relative shrink-0">
          <div
            className="flex size-9 items-center justify-center rounded-full text-[12px] font-semibold"
            style={{ backgroundColor: conversation.avatarBg, color: conversation.avatarColor }}
          >
            {conversation.initials}
          </div>
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#3D8A5A] ring-2 ring-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[#1A1918]">{conversation.name}</p>
          <p className="text-[11px] text-[#9C9B99]">
            {conversation.isOnline ? 'En linea' : 'Desconectado'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite(conversation.id)}
          title={conversation.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F5F4F1]"
        >
          <Star
            className={cn(
              'size-4.5 transition-colors',
              conversation.isFavorite
                ? 'fill-[#F5A623] text-[#F5A623]'
                : 'text-[#9C9B99] hover:text-[#F5A623]',
            )}
          />
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#F5F4F1] px-5 py-4">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
            <MessageSquarePlus className="size-8 text-[#C5C4C2]" />
            <p className="text-[13px] text-[#9C9B99]">Aun no hay mensajes. Escribe el primero.</p>
          </div>
        ) : (
          conversation.messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-[#E5E4E1] bg-white px-4 py-3">
        {/* ── Recording indicator ── */}
        {isRecording && (
          <>
            <style>{`
              @keyframes voiceBar {
                0%, 100% { transform: scaleY(0.25); }
                50%       { transform: scaleY(1); }
              }
            `}</style>
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5">
              {/* Cancel */}
              <button
                type="button"
                onClick={cancelRecording}
                title="Cancelar grabacion"
                className="flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-red-100"
              >
                <Trash2 className="size-4.5 text-red-400" />
              </button>

              {/* Animated waveform */}
              <div className="flex flex-1 items-center justify-center gap-[3px]">
                {WAVE_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] origin-center rounded-full bg-red-400"
                    style={{
                      height: `${h}px`,
                      animation: 'voiceBar 1.1s ease-in-out infinite',
                      animationDelay: `${i * 55}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Timer + pulse dot */}
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-[13px] font-semibold tabular-nums text-red-500">
                  {formatRecordingTime(recordingTime)}
                </span>
                <span className="size-2.5 animate-pulse rounded-full bg-red-500" />
              </div>

              {/* Send */}
              <button
                type="button"
                onClick={sendRecording}
                title="Enviar nota de voz"
                className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#3D8A5A] text-white transition-colors hover:bg-[#336b49]"
              >
                <Send className="size-4" />
              </button>
            </div>
          </>
        )}

        {/* ── Normal input ── */}
        {!isRecording && (
          <>
            {/* Pending attachment chip */}
            {pendingAttachment && (
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2">
                <AttachmentIcon
                  kind={pendingAttachment.kind}
                  className="size-4 shrink-0 text-[#6D6C6A]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-[#1A1918]">
                    {pendingAttachment.name}
                  </p>
                  <p className="text-[10px] text-[#9C9B99]">{pendingAttachment.size}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingAttachment(null)}
                  className="flex size-5 shrink-0 items-center justify-center rounded-full text-[#9C9B99] transition-colors hover:bg-[#E5E4E1] hover:text-[#1A1918]"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}

            {/* Input row */}
            <div className="relative flex items-center gap-2 rounded-2xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2 transition-colors focus-within:border-[#3D8A5A] focus-within:bg-white">
              {/* File picker trigger */}
              <div ref={filePickerRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFilePicker((v) => !v)
                    setShowEmoji(false)
                  }}
                  className={cn(
                    'shrink-0 transition-colors',
                    showFilePicker ? 'text-[#3D8A5A]' : 'text-[#9C9B99] hover:text-[#6D6C6A]',
                  )}
                  aria-label="Adjuntar archivo"
                >
                  <Paperclip className="size-4.5" />
                </button>

                {showFilePicker && (
                  <div className="absolute bottom-10 left-0 z-20 w-56 rounded-2xl border border-[#E5E4E1] bg-white p-3 shadow-xl">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9C9B99]">
                      Adjuntar
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {FILE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => fileInputRefs.current[cat.id]?.click()}
                          className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-colors hover:bg-[#FAFAF8]"
                        >
                          <div
                            className="flex size-10 items-center justify-center rounded-xl"
                            style={{ backgroundColor: cat.bg }}
                          >
                            <cat.icon className="size-5" color={cat.color} />
                          </div>
                          <span className="text-[11px] font-medium text-[#1A1918]">
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {FILE_CATEGORIES.map((cat) => (
                      <input
                        key={cat.id}
                        ref={(el) => {
                          fileInputRefs.current[cat.id] = el
                        }}
                        type="file"
                        accept={cat.accept}
                        {...(cat.capture ? { capture: cat.capture as 'environment' } : {})}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, cat)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
                style={{ maxHeight: '120px' }}
              />

              {/* Emoji picker trigger */}
              <div ref={emojiRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmoji((v) => !v)
                    setShowFilePicker(false)
                  }}
                  className={cn(
                    'shrink-0 transition-colors',
                    showEmoji ? 'text-[#3D8A5A]' : 'text-[#9C9B99] hover:text-[#6D6C6A]',
                  )}
                  aria-label="Emoji"
                >
                  <Smile className="size-4.5" />
                </button>

                {showEmoji && (
                  <div className="absolute bottom-10 right-0 z-20 w-72 rounded-2xl border border-[#E5E4E1] bg-white p-3 shadow-xl">
                    <div className="flex max-h-52 flex-col gap-3 overflow-y-auto">
                      {EMOJI_GROUPS.map((group) => (
                        <div key={group.label}>
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#9C9B99]">
                            {group.label}
                          </p>
                          <div className="flex flex-wrap gap-0.5">
                            {group.emojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => insertEmoji(emoji)}
                                className="flex size-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-[#F5F4F1]"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Send or Mic */}
              {canSend ? (
                <button
                  type="button"
                  onClick={handleSend}
                  className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#3D8A5A] text-white transition-colors hover:bg-[#336b49]"
                  aria-label="Enviar mensaje"
                >
                  <Send className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex size-8 shrink-0 items-center justify-center rounded-xl text-[#9C9B99] transition-colors hover:bg-[#E5E4E1] hover:text-[#3D8A5A]"
                  aria-label="Grabar nota de voz"
                >
                  <Mic className="size-4.5" />
                </button>
              )}
            </div>

            <p className="mt-1.5 text-center text-[10px] text-[#9C9B99]">
              Presiona Enter para enviar, Shift+Enter para nueva linea
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Empty state
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
// New Chat Modal
// ---------------------------------------------------------------------------

interface NewChatModalProps {
  existingIds: string[]
  onClose: () => void
  onConfirm: (member: (typeof MOCK_MEMBERS)[number]) => void
}

function NewChatModal({ existingIds, onClose, onConfirm }: NewChatModalProps) {
  const [search, setSearch] = useState('')

  const filtered = MOCK_MEMBERS.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E4E1] px-6 py-4">
          <div className="flex items-center gap-2">
            <PenSquare className="size-5 text-[#3D8A5A]" />
            <h2 className="text-[15px] font-semibold text-[#1A1918]">Nuevo Chat</h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1] hover:text-[#1A1918]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-[#E5E4E1] px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2">
            <Search className="size-3.5 shrink-0 text-[#9C9B99]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar miembro..."
              autoFocus
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
            />
          </div>
        </div>

        {/* Member list */}
        <div className="flex max-h-[280px] flex-col divide-y divide-[#E5E4E1] overflow-y-auto">
          {filtered.length === 0 && (
            <p className="py-8 text-center text-[13px] text-[#9C9B99]">Sin resultados</p>
          )}
          {filtered.map((member) => {
            const alreadyExists = existingIds.includes(member.id)
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => onConfirm(member)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                  alreadyExists ? 'opacity-50 cursor-default' : 'hover:bg-[#F0FAF4]',
                )}
                disabled={alreadyExists}
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{ backgroundColor: member.avatarBg, color: member.avatarColor }}
                >
                  {member.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-[#1A1918]">{member.name}</p>
                  {alreadyExists && (
                    <p className="text-[11px] text-[#9C9B99]">Ya tienes una conversacion</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Create Group Modal
// ---------------------------------------------------------------------------

interface CreateGroupModalProps {
  onClose: () => void
  onConfirm: (name: string) => void
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
            className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1] hover:text-[#1A1918]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-4">
          {/* Group name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6D6C6A]">Nombre del Grupo</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ej. Pastores del Concilio"
              className="rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2.5 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] transition-colors focus:border-[#3D8A5A] focus:bg-white"
            />
          </div>

          {/* Members */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-[#6D6C6A]">Agregar Miembros</label>
              <span className="text-[11px] text-[#9C9B99]">{selectedIds.length} seleccionados</span>
            </div>
            <div className="flex max-h-[220px] flex-col divide-y divide-[#E5E4E1] overflow-hidden overflow-y-auto rounded-xl border border-[#E5E4E1]">
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
            className="rounded-xl border border-[#E5E4E1] px-4 py-2 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => canCreate && onConfirm(groupName.trim())}
            disabled={!canCreate}
            className={cn(
              'rounded-xl px-4 py-2 text-[13px] font-medium text-white transition-colors',
              canCreate
                ? 'bg-[#3D8A5A] hover:bg-[#336b49]'
                : 'cursor-not-allowed bg-[#E5E4E1] text-[#9C9B99]',
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
// New chat dropdown button
// ---------------------------------------------------------------------------

interface NewChatDropdownProps {
  onNewChat: () => void
  onNewGroup: () => void
}

function NewChatDropdown({ onNewChat, onNewGroup }: NewChatDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Nuevo mensaje"
        className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#3D8A5A] text-white transition-colors hover:bg-[#336b49]"
      >
        <Plus className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-[#E5E4E1] bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onNewChat()
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#1A1918] transition-colors hover:bg-[#F5F4F1]"
          >
            <PenSquare className="size-4 text-[#6D6C6A]" />
            Nuevo Chat
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onNewGroup()
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#1A1918] transition-colors hover:bg-[#F5F4F1]"
          >
            <Users className="size-4 text-[#6D6C6A]" />
            Nuevo Grupo
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS)
  const [searchValue, setSearchValue] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [showNewChat, setShowNewChat] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const [activeId, setActiveId] = useState<string | null>(null)

  // After hydration, auto-select the first conversation on desktop
  useEffect(() => {
    if (window.innerWidth >= 1024 && conversations.length > 0) {
      setActiveId(conversations[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null

  // IDs of existing DM conversations (non-groups) matched against MOCK_MEMBERS by name
  const existingDmNames = conversations
    .filter((c) => !c.name.startsWith('Grupo:'))
    .map((c) => c.name)

  const existingMemberIds = MOCK_MEMBERS.filter((m) => existingDmNames.includes(m.name)).map(
    (m) => m.id,
  )

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchValue.toLowerCase())
    if (!matchesSearch) return false
    if (activeFilter === 'unread') return c.unreadCount > 0
    if (activeFilter === 'favorites') return c.isFavorite
    return true
  })

  function handleSend(conversationId: string, text: string, attachment?: MessageAttachment) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c
        const newMessage: Message = {
          id: `m${Date.now()}`,
          body: text,
          sentAt: new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' }),
          isMine: true,
          status: 'sent',
          attachment,
        }
        const preview = attachment ? `📎 ${attachment.name}` : text
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: preview,
          lastTime: newMessage.sentAt,
        }
      }),
    )
  }

  function handleToggleFavorite(id: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)),
    )
  }

  function handleNewChat(member: (typeof MOCK_MEMBERS)[number]) {
    const existing = conversations.find((c) => c.name === member.name)
    if (existing) {
      setActiveId(existing.id)
      setShowNewChat(false)
      return
    }
    const newConv: Conversation = {
      id: `dm${Date.now()}`,
      name: member.name,
      initials: member.initials,
      avatarBg: member.avatarBg,
      avatarColor: member.avatarColor,
      lastMessage: '',
      lastTime: 'Ahora',
      unreadCount: 0,
      isOnline: false,
      isFavorite: false,
      messages: [],
    }
    setConversations((prev) => [newConv, ...prev])
    setActiveId(newConv.id)
    setShowNewChat(false)
  }

  function handleCreateGroup(name: string) {
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
      isFavorite: false,
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
            {/* Search + new button */}
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
                <NewChatDropdown
                  onNewChat={() => setShowNewChat(true)}
                  onNewGroup={() => setShowCreateGroup(true)}
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex shrink-0 border-b border-[#E5E4E1]">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={cn(
                    'flex-1 py-2.5 text-[12px] font-medium transition-colors',
                    activeFilter === tab.key
                      ? 'border-b-2 border-[#3D8A5A] text-[#3D8A5A]'
                      : 'text-[#9C9B99] hover:text-[#6D6C6A]',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 divide-y divide-[#E5E4E1] overflow-y-auto">
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
                  <p className="text-[13px] text-[#9C9B99]">
                    {activeFilter === 'unread'
                      ? 'No tienes mensajes sin leer'
                      : activeFilter === 'favorites'
                        ? 'No tienes conversaciones favoritas'
                        : 'Sin resultados'}
                  </p>
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
              <ChatView
                conversation={activeConversation}
                onSend={handleSend}
                onToggleFavorite={handleToggleFavorite}
                onBack={() => setActiveId(null)}
              />
            ) : (
              <NoConversationSelected />
            )}
          </div>
        </div>
      </div>

      {showNewChat && (
        <NewChatModal
          existingIds={existingMemberIds}
          onClose={() => setShowNewChat(false)}
          onConfirm={handleNewChat}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} onConfirm={handleCreateGroup} />
      )}
    </div>
  )
}
