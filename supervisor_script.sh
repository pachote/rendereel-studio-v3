#!/bin/bash

print_header() {
  echo "================================================================="
  echo "$1"
  echo "================================================================="
}

get_confirmation() {
  while true; do
    read -p "$1 (yes/no): " yn
    case $yn in
      [Yy]* ) return 0;;
      [Nn]* ) return 1;;
      * ) echo "Please answer yes or no.";;
    esac
  done
}

phase_one_backend() {
  print_header "PHASE 1: BACKEND CONSTRUCTION & VERIFICATION"
  echo "INSTRUCTION: Your sole focus is to build the backend API using Next.js API Routes. This includes:"
  echo "- Fetching a MASSIVE library of EVERY available open-source FLUX and SDXL model (SFW & NSFW versions) using full pagination."
  echo "- Fetching EVERY available SFW style LoRA, character LoRA, and adult NSFW LoRA for both FLUX and SDXL using full pagination."
  echo "- Fetching EVERY available SFW and NSFW LoRA specifically for WAN 2.2 using full pagination."
  echo "You are forbidden from writing any frontend UI code during this phase."
  echo "Please build the backend now..."
  echo ""
  echo "VERIFICATION STEP: Now, you must prove the backend is working."
  echo "Run 'curl' commands for each data type and paste the successful JSON output."
  echo "The output must show a massive list of real data, not placeholders."
  echo "Waiting for you to run the commands and confirm their success..."
  echo ""
}

phase_two_frontend_connection() {
  print_header "PHASE 2: FRONTEND CONNECTION & DATA VALIDATION"
  echo "INSTRUCTION: Your sole focus is to connect the frontend to the backend."
  echo "Build the basic application shell and the code to call the API."
  echo "Please begin the frontend connection now..."
  echo ""
  echo "VERIFICATION STEP: Now, you must prove the data is flowing."
  echo "Confirm that all model and LoRA dropdown menus are fully populated."
  echo "The lists should contain thousands of items. Provide screenshots as proof."
  echo ""
}

phase_three_features() {
  print_header "PHASE 3: FULL FEATURE IMPLEMENTATION"
  echo "INSTRUCTION: With a working data connection, you are now authorized to build the full UI and platform systems."
  echo "You will now build the following, exactly as specified:"
  echo ""
  echo "--- Part 3.1: Global UI & Navigation ---"
  echo "- A new global layout with a left-side menu bar for all authenticated pages (like Kling AI)."
  echo "- A professional footer with links to Terms of Service, Privacy Policy, and Contact."
  echo "- A flawless, Mobile-First Progressive Web App (PWA)."
  echo ""
  echo "--- Part 3.2: Generation Interfaces & Workflow ---"
  echo "- The complete 'Forge WebUI Clone' for images, including Negative Prompt, Samplers, Upscaler (with pixel size selection), and ADetailer."
  echo "- The dynamic interfaces for Kling AI (v1.6 & v2.1) and WAN 2.2. Remove all other video models."
  echo "- The context-aware LoRA selector for WAN 2.2, with preview images."
  echo "- Organize Model/LoRA Lists: All dropdowns MUST be sorted (e.g., Most Popular) and grouped by category (e.g., Style, Character, NSFW)."
  echo "- The post-generation 'Lip Sync' button for finished Kling videos, with a dedicated audio upload screen."
  echo "- Post-generation options: All finished media MUST have 'Download' and 'Post to Profile' buttons."
  echo "- A 'Send to Video' button on finished images to start an Image-to-Video job."
  echo ""
  echo "--- Part 3.3: Platform Systems & Monetization ---"
  echo "- A public '/pricing' page showcasing the three subscription tiers."
  echo "- A system for users to buy additional credit packs that never expire."
  echo "- A professional Account/Settings page with profile editing, password change, billing management, and a secure account deletion option."
  echo "- A private user 'Assets' page to manage all generated media."
  echo "- A Civitai-style NSFW filter system (user-controlled, with content blurring)."
  echo "- A strict, non-negotiable anti-CSAM filter on all prompts."
  echo "- Creation of legal pages (Terms of Service, Privacy Policy) with clear anti-CSAM policies."
  echo "- Full implementation of the Subscription System with Square and Google Login."
  echo ""
  echo "Please begin the full feature implementation now..."
  echo ""
  echo "VERIFICATION STEP: Deploy the final application to Vercel and provide the live URL."
  echo ""
}

phase_one_backend
if get_confirmation "PHASE 1 VERIFICATION: Does the 'curl' output show a massive and correct list of data for ALL model and LoRA types?"; then
  echo "Phase 1 Approved. Proceeding to Phase 2."
  echo ""
  phase_two_frontend_connection
  if get_confirmation "PHASE 2 VERIFICATION: Are all dropdowns on the UI populated with thousands of items?"; then
    echo "Phase 2 Approved. Proceeding to Phase 3."
    echo ""
    phase_three_features
    echo "🎉 PROJECT COMPLETE. Awaiting final review of the deployed application."
  else
    echo "❌ PHASE 2 FAILED. Please debug the frontend connection and re-run this script."
    exit 1
  fi
else
  echo "❌ PHASE 1 FAILED. Please debug the backend and re-run this script."
  exit 1
fi
