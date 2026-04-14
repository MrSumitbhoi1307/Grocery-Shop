import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
    return (
        /* mt-0 kar diya hai taaki Newsletter se gap khatam ho jaye */
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-0 bg-gray-100"> 
            
            {/* Top Section - Padding py-8 (balanced gap) */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-8 border-b border-gray-300 text-gray-500">
                
                {/* Logo Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img className="w-9 h-9 object-contain" src="/favicon.svg" alt="logo" />
                        <h1 className="text-xl font-bold text-gray-800">
                            <span className="text-green-600">Sumit</span>Grocery
                        </h1>
                    </div>
                    <p className="max-w-[400px] text-sm">
                        We deliver fresh groceries and snacks straight to your door. 
                        Trusted by thousands, we aim to make your shopping experience simple.
                    </p>
                </div>

                {/* Links Section */}
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-bold text-sm text-gray-900 mb-3">{section.title}</h3>
                            <ul className="text-xs space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:text-green-600 transition-colors">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Copyright Section */}
            <p className="py-4 text-center text-[12px] text-gray-400">
                Copyright {new Date().getFullYear()} © SumitGrocery.com - All Rights Reserved.
            </p>
        </div>
    );
};

export default Footer;