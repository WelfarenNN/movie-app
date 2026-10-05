import { LightLogo } from "../Icons/LightLogo";
import { PhoneLogo } from "../Icons/PhoneLogo";
import { MailLogo } from "../Icons/MailLogo";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#4338CA] px-6 md:px-20 py-10">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <LightLogo />
          </div>
          <div className="text-[#fafafa] text-sm font-normal">
            © 2024 Movie Z. All Rights Reserved.
          </div>
        </div>

        <div className="flex-1 w-full flex justify-start md:justify-end">
          <div className="flex flex-col sm:flex-row gap-12 md:gap-24 w-full md:w-auto md:justify-end">
            <div className="flex flex-col gap-4">
              <div className="text-base font-normal text-[#fafafa]">
                Contact Information
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-end gap-3">
                  <div className="mt-1">
                    <MailLogo />
                  </div>
                  <div className="text-sm font-normal text-[#fafafa] leading-tight">
                    <div className="text-white/70">Email:</div>
                    <div className="cursor-pointer hover:underline">
                      support@movieZ.com
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <PhoneLogo />
                  </div>
                  <div className="text-sm font-normal text-[#fafafa] leading-tight">
                    <div className="text-white/70">Phone:</div>
                    <div className="cursor-pointer hover:underline">
                      +976 (11) 123-4567
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-base font-medium text-[#fafafa]">
                Follow us
              </div>
              <div className="flex flex-wrap md:flex-row gap-4 text-sm font-normal text-[#fafafa]">
                <div className="cursor-pointer hover:underline">Facebook</div>
                <div className="cursor-pointer hover:underline">Instagram</div>
                <div className="cursor-pointer hover:underline">Twitter</div>
                <div className="cursor-pointer hover:underline">YouTube</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
