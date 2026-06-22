import { User, Bell, Lock, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile, security, and notification preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
            <nav className="flex flex-col">
              <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-l-4 border-lic-blue text-lic-blue font-bold text-left">
                <User size={20} /> Profile Information
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-left transition-colors border-l-4 border-transparent">
                <Lock size={20} /> Security & Password
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-left transition-colors border-l-4 border-transparent">
                <Bell size={20} /> Notifications
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
            <form className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-100 text-lic-blue rounded-full flex items-center justify-center text-3xl font-bold">
                  JD
                </div>
                <div>
                  <button type="button" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 text-sm">
                    Change Avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all" defaultValue="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all" defaultValue="Doe" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 outline-none" defaultValue="john.doe@example.com" disabled />
                  <p className="text-xs text-gray-500 mt-1">To change your email, please contact support.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lic-blue outline-none transition-all" defaultValue="+91 98765 43210" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="button" className="px-6 py-3 bg-lic-blue text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-md">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
