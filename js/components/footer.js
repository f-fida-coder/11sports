export function footerTemplate(basePath = '') {
  return `
    <footer class="border-t border-emerald-500/20 bg-[#040c08]">
      <div class="mx-auto max-w-[1400px] px-4 py-10">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-400">Products</h3>
            <a href="${basePath}pages/sportsbook.html" class="footer-link">Sports Betting</a>
            <a href="${basePath}pages/live.html" class="footer-link">Live Betting</a>
            <a href="${basePath}pages/casino.html" class="footer-link">Casino</a>
            <a href="${basePath}pages/virtual.html" class="footer-link">Virtual Sports</a>
          </div>
          <div>
            <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-400">Information</h3>
            <a href="#" class="footer-link">About 11sport</a>
            <a href="#" class="footer-link">Terms & Conditions</a>
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">AML/KYC Policy</a>
          </div>
          <div>
            <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-400">Support</h3>
            <a href="#" class="footer-link">Help Center</a>
            <a href="#" class="footer-link">Contact Us</a>
            <a href="#" class="footer-link">Responsible Gambling</a>
            <a href="#" class="footer-link">Self Exclusion</a>
          </div>
          <div>
            <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-400">Legal</h3>
            <p class="muted text-sm">18+ only. Gambling can be addictive. Please play responsibly and only if legal in your jurisdiction.</p>
          </div>
        </div>

        <div class="mt-8 border-t border-emerald-500/20 pt-4 text-xs text-slate-400">
          <p>Copyright © 2026 11sport.bet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}
