import { BotControlPanel } from '@/components/admin/discord/BotControlPanel'

export default function DiscordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Discord Bot Control Panel
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Пълно управление на Discord бота: сървъри, канали, съобщения и членове
        </p>
      </div>
      <BotControlPanel />
    </div>
  )
}
