import { LanguageSettings } from "@/components/settings/language-settings"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 gap-8">
        <LanguageSettings />

        {/* Other settings components would go here */}
      </div>
    </div>
  )
}
