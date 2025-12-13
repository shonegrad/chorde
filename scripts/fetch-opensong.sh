#!/bin/bash

# Automated Open Source Song Import Script
# This script fetches songs from open-source repositories and imports them

echo "🎸 Chorde - Open Source Song Importer"
echo "======================================"
echo ""

# Create temp directory
TEMP_DIR="$HOME/.chorde-temp-imports"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "📁 Created temp directory: $TEMP_DIR"
echo ""

# Clone worship song repositories
echo "📥 Cloning open-source repositories..."
echo ""

if [ ! -d "joey-worship" ]; then
    echo "  → Cloning joeycortez42/worship..."
    git clone --quiet https://github.com/joeycortez42/worship.git joey-worship 2>/dev/null
    echo "  ✓ Joey's worship songs cloned"
fi

if [ ! -d "matt-worship" ]; then
    echo "  → Cloning mattgraham/worship..."
    git clone --quiet https://github.com/mattgraham/worship.git matt-worship 2>/dev/null
    echo "  ✓ Matt's worship songs cloned"
fi

echo ""
echo "📊 Counting songs..."

# Count ChordPro files
JOEY_COUNT=$(find joey-worship -type f \( -name "*.cho" -o -name "*.crd" -o -name "*.pro" \) 2>/dev/null | wc -l | tr -d ' ')
MATT_COUNT=$(find matt-worship -type f \( -name "*.cho" -o -name "*.crd" -o -name "*.pro" \) 2>/dev/null | wc -l | tr -d ' ')
TOTAL_COUNT=$((JOEY_COUNT + MATT_COUNT))

echo "  Joey's collection: $JOEY_COUNT songs"
echo "  Matt's collection: $MATT_COUNT songs"
echo "  ─────────────────────────────"
echo "  Total: $TOTAL_COUNT worship songs"
echo ""

if [ $TOTAL_COUNT -eq 0 ]; then
    echo "❌ No songs found. Repositories might be empty or format different."
    echo "   You can still use the public domain songs in the app!"
    exit 1
fi

echo "✅ Successfully found $TOTAL_COUNT open-source worship songs!"
echo ""
echo "📋 Next steps:"
echo "  1. Review songs in: $TEMP_DIR"
echo "  2. Run import script to convert to TypeScript format"
echo "  3. Merge with existing seedSongs.ts"
echo ""
echo "💡 Import command:"
echo "  cd $(pwd | sed 's|.*/chorde.*|/Users/YOUR_USER/chorde|')"
echo "  npx ts-node scripts/importSongs.ts $TEMP_DIR/joey-worship"
echo ""
echo "🎉 Done! You now have access to $TOTAL_COUNT legal, open-source songs!"
