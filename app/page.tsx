'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, ChevronRight, Moon } from 'lucide-react';

const SONG_SRC = '/Nallai-Allai.mp3';

const createSeededRandom = (seed: number) => {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

const createFixedValue = (
  random: () => number,
  min: number,
  max: number,
  decimals = 4
) => Number((random() * (max - min) + min).toFixed(decimals));

const createPercentage = (random: () => number) =>
  `${createFixedValue(random, 0, 100)}%`;

// Keep decorative animation inputs deterministic so SSR and hydration match.
const FLOATING_PARTICLES = (() => {
  const random = createSeededRandom(0x1a2b3c4d);

  return Array.from({ length: 15 }, (_, id) => ({
    id,
    left: createPercentage(random),
    duration: createFixedValue(random, 2, 5),
    delay: createFixedValue(random, 0, 2),
  }));
})();

const CELEBRATION_HEARTS = (() => {
  const random = createSeededRandom(0x5e6f7788);

  return Array.from({ length: 20 }, (_, id) => ({
    id,
    left: createPercentage(random),
    rotate: createFixedValue(random, 0, 360),
    duration: createFixedValue(random, 2, 5),
    size: createFixedValue(random, 20, 60, 2),
  }));
})();

const SPARKLE_PARTICLES = (() => {
  const random = createSeededRandom(0x0f1e2d3c);

  return Array.from({ length: 30 }, (_, id) => ({
    id,
    left: createPercentage(random),
    top: createPercentage(random),
    duration: createFixedValue(random, 1, 3),
    delay: createFixedValue(random, 0, 2),
  }));
})();

const ENTRY_SHARDS = (() => {
  const random = createSeededRandom(0x6b5d4f3a);

  return Array.from({ length: 18 }, (_, id) => {
    const angle = random() * Math.PI * 2;
    const distance = createFixedValue(random, 110, 260, 2);

    return {
      id,
      x: Number((Math.cos(angle) * distance).toFixed(2)),
      y: Number((Math.sin(angle) * distance).toFixed(2)),
      rotate: createFixedValue(random, -260, 260, 2),
      width: createFixedValue(random, 12, 34, 2),
      height: createFixedValue(random, 6, 14, 2),
      delay: createFixedValue(random, 0, 0.14, 2),
      colorClass:
        id % 3 === 0 ? 'bg-[#ff8fb4]' : id % 3 === 1 ? 'bg-[#f0c18f]' : 'bg-white/80',
    };
  });
})();

export default function LoveLetterExperience() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [entryState, setEntryState] = useState<'splash' | 'breaking' | 'story'>('splash');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const entryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    const handlePlay = () => setMusicPlaying(true);
    const handlePause = () => setMusicPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (entryTimeoutRef.current !== null) {
        window.clearTimeout(entryTimeoutRef.current);
      }
    };
  }, []);

  const playAudio = async (restart = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    if (restart) {
      audio.currentTime = 0;
    }

    try {
      await audio.play();
    } catch {
      setMusicPlaying(false);
    }
  };

  const handleBeginExperience = async () => {
    if (entryState !== 'splash') return;

    setEntryState('breaking');
    await playAudio(true);

    if (entryTimeoutRef.current !== null) {
      window.clearTimeout(entryTimeoutRef.current);
    }

    entryTimeoutRef.current = window.setTimeout(() => {
      setEntryState('story');
    }, 1100);
  };

  const handleMusicToggle = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      void playAudio();
      return;
    }

    audio.pause();
  };

  const sections = [
    {
      id: 'intro',
      title: 'A Surprise for You',
      label: 'The Beginning',
    },
    {
      id: 'date',
      title: 'Your Birthday',
      label: 'March 27, 2026',
    },
    {
      id: 'deep',
      title: 'The Deep Connection',
      label: 'Deep & Deepthi',
    },
    {
      id: 'meaning',
      title: 'What You Mean',
      label: 'My Peace',
    },
    {
      id: 'falling',
      title: 'Falling Every Day',
      label: 'The Dream',
    },
    {
      id: 'confession',
      title: 'What I Never Said',
      label: 'My Truth',
    },
    {
      id: 'joy',
      title: 'Your Happiness',
      label: 'Your Inner Light',
    },
    {
      id: 'team',
      title: 'We Are Team',
      label: 'Forever Together',
    },
    {
      id: 'final',
      title: 'The Final Truth',
      label: 'You Are My Everything',
    },
    {
      id: 'song',
      title: 'Mudhal Nee Mudivum Nee',
      label: 'Mudhal Nee Mudivum Nee',
    },
    {
      id: 'ask',
      title: 'One Last Question',
      label: 'The Most Important',
    },
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((section) => section + 1);
    } else {
      setShowCelebration(true);
    }
  };

  const handleReplay = () => {
    setCurrentSection(0);
    setShowCelebration(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-[#1a0f15] to-[#0a0a0a] overflow-hidden">
      <audio ref={audioRef} src={SONG_SRC} preload="auto" loop playsInline />

      {/* Mouse follower glow */}
      <motion.div
        className="fixed w-64 h-64 bg-gradient-to-r from-[#d4376a]/30 to-[#c89369]/20 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 100,
          mass: 1,
        }}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-[#d4376a]/20 to-[#8b2d50]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '10%', left: '-10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-[#c89369]/20 to-[#d4376a]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ bottom: '10%', right: '-10%' }}
        />

        {/* Floating particles */}
        {FLOATING_PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-[#d4376a]/50 rounded-full"
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            style={{
              left: particle.left,
              bottom: '-10px',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {entryState !== 'story' ? (
          <OpeningScreen
            key="opening-screen"
            isBreaking={entryState === 'breaking'}
            onBegin={handleBeginExperience}
          />
        ) : !showCelebration ? (
          <motion.div
            key={`section-${currentSection}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4"
          >
            {currentSection === 0 && <IntroSection />}
            {currentSection === 1 && <DateSection />}
            {currentSection === 2 && <DeepSection />}
            {currentSection === 3 && <MeaningSection />}
            {currentSection === 4 && <FallingSection />}
            {currentSection === 5 && <ConfessionSection />}
            {currentSection === 6 && <JoySection />}
            {currentSection === 7 && <TeamSection />}
            {currentSection === 8 && <FinalSection />}
            {currentSection === 9 && <SongSection />}
            {currentSection === 10 && <AskSection />}

            {/* Progress Bar */}
            <motion.div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4376a] via-[#c89369] to-[#d4376a]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (currentSection + 1) / sections.length }}
              transition={{ duration: 0.5 }}
              style={{ originX: 0 }}
            />

            {/* Navigation */}
            <motion.button
              onClick={handleNext}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-[#d4376a] to-[#8b2d50] hover:from-[#e6478e] hover:to-[#9a3460] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 shadow-2xl hover:shadow-[#d4376a]/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentSection === sections.length - 1 ? 'Celebrate' : 'Continue'}
              <ChevronRight size={20} />
            </motion.button>

            {/* Music Toggle */}
            <motion.button
              onClick={handleMusicToggle}
              className={`fixed top-8 right-8 border p-3 rounded-full backdrop-blur-md transition-all ${
                musicPlaying
                  ? 'border-[#d4376a]/50 bg-[#d4376a]/20 text-white shadow-lg shadow-[#d4376a]/30'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              }`}
              title={musicPlaying ? 'Pause song' : 'Play Nallai Allai'}
              aria-label={musicPlaying ? 'Pause song' : 'Play Nallai Allai'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Music size={20} />
            </motion.button>

            {/* Chapter Indicator */}
            <motion.div
              className="fixed top-8 left-8 text-white/60 text-sm font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-[#d4376a] font-bold text-lg">{sections[currentSection].label}</div>
              <div className="text-xs text-white/40 mt-1">{currentSection + 1} of {sections.length}</div>
            </motion.div>
          </motion.div>
        ) : (
          <CelebrationSection onReplay={handleReplay} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Section Components
function OpeningScreen({
  isBreaking,
  onBegin,
}: {
  isBreaking: boolean;
  onBegin: () => void;
}) {
  const wishes = [
    'More peace in your mind.',
    'More laughter in your days.',
    'More moments that make you feel deeply loved.',
  ];

  return (
    <motion.div
      key="birthday-gate"
      className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4376a]/16 blur-3xl"
          animate={{ scale: isBreaking ? [1, 1.35, 1.7] : [1, 1.06, 1] }}
          transition={{ duration: isBreaking ? 0.85 : 4.2, repeat: isBreaking ? 0 : Infinity, ease: 'easeInOut' }}
        />

        {ENTRY_SHARDS.map((shard) => (
          <motion.span
            key={shard.id}
            className={`absolute left-1/2 top-1/2 rounded-full ${shard.colorClass}`}
            style={{
              width: `${shard.width}px`,
              height: `${shard.height}px`,
            }}
            initial={{ x: -shard.width / 2, y: -shard.height / 2, opacity: 0, rotate: 0, scale: 0.9 }}
            animate={
              isBreaking
                ? {
                    x: shard.x,
                    y: shard.y,
                    opacity: [0, 1, 0],
                    rotate: shard.rotate,
                    scale: [0.9, 1, 0.8],
                  }
                : {
                    x: -shard.width / 2,
                    y: -shard.height / 2,
                    opacity: 0,
                    rotate: 0,
                    scale: 0.9,
                  }
            }
            transition={{ duration: 0.9, delay: shard.delay, ease: 'easeOut' }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isBreaking ? { opacity: [0, 0.45, 0], scale: [0.8, 2.2, 2.7] } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-3xl overflow-hidden rounded-[2.4rem] border border-[#f6dce3]/15 bg-black/30 p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={
          isBreaking
            ? {
                scale: [1, 1.06, 0.76],
                rotate: [0, -2, 7],
                opacity: [1, 1, 0],
                filter: ['blur(0px)', 'blur(0px)', 'blur(10px)'],
              }
            : {
                scale: 1,
                rotate: 0,
                opacity: 1,
                filter: 'blur(0px)',
              }
        }
        transition={{ duration: isBreaking ? 0.95 : 0.55, ease: 'easeInOut' }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4376a]/16 via-transparent to-[#c89369]/10" />

        <div className="relative">
          <p className="text-[0.72rem] font-black uppercase tracking-[0.42em] text-[#f0c18f]">
            Birthday Gate
          </p>
          <h1 className="mt-6 text-5xl font-black leading-none text-white md:text-7xl">
            Happy Birthday
            <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-[#ff8fb4] via-[#ffd0df] to-[#f0c18f]">
              Deepthisirii
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl">
            A few wishes before the chaos starts:
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left md:grid-cols-3">
            {wishes.map((wish, index) => (
              <motion.div
                key={wish}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm font-medium leading-relaxed text-white/80"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 + index * 0.08 }}
              >
                {wish}
              </motion.div>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={onBegin}
            disabled={isBreaking}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#d4376a] to-[#a62655] px-8 py-4 text-base font-bold text-white shadow-[0_18px_50px_rgba(212,55,106,0.35)] transition-transform disabled:cursor-wait"
            whileHover={isBreaking ? undefined : { scale: 1.04 }}
            whileTap={isBreaking ? undefined : { scale: 0.96 }}
          >
            {isBreaking ? 'Breaking open...' : 'Lets Go 22'}
            <Heart size={18} fill="currentColor" />
          </motion.button>

          <p className="mt-4 text-sm text-white/45">
            (P.S. If you don&apos;t feel the love yet, just wait. The best is yet to come.)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IntroSection() {
  return (
    <motion.div className="text-center max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="mb-8"
      >
        <Heart className="w-24 h-24 text-[#d4376a] mx-auto drop-shadow-lg" fill="#d4376a" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
      >
        Hey Deepu Kutty,
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed"
      >
        I made something special for you. Something that took time to create because you deserve to know how deeply I love you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mt-12"
      >
        <p className="text-white/60 text-lg italic">
          "This isn't just a website. This is my heart, written in moments and memories."
        </p>
      </motion.div>
    </motion.div>
  );
}

function DateSection() {
  return (
    <motion.div className="text-center max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-12"
      >
        Happy Birthday, My Love
      </motion.h2>

      <motion.div
        className="bg-gradient-to-br from-[#d4376a]/20 to-[#8b2d50]/20 backdrop-blur-md border border-[#d4376a]/30 rounded-2xl p-12 mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="text-6xl md:text-7xl font-bold text-[#d4376a] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          March 27, 2026
        </motion.p>
        <motion.p
          className="text-xl text-white/60 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The day the world became more beautiful because you were born....
           Epudiii 😎
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p className="text-white/70 text-lg leading-relaxed italic">
          "Ennai natchathira kaattil alayavittai… Naan endra ennam tholayavittai…"
        </p>
        <p className="text-white/50 text-sm mt-4">
          (You lost me among the stars... I lost my name in you...)
        </p>
      </motion.div>
    </motion.div>
  );
}

function DeepSection() {
  return (
    <motion.div className="text-center max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
          Maybe This Love Feels So...
        </h2>

        <motion.div
          className="relative inline-block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#d4376a] to-[#8b2d50] rounded-full blur-3xl opacity-50" />
          <div className="relative bg-gradient-to-br from-[#d4376a]/30 to-[#8b2d50]/30 backdrop-blur-md border border-[#d4376a]/50 rounded-full p-16 mb-12">
            <motion.p
              className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4376a] to-[#c89369]"
              animate={{
                textShadow: [
                  '0 0 20px rgba(212, 55, 106, 0.3)',
                  '0 0 40px rgba(212, 55, 106, 0.6)',
                  '0 0 20px rgba(212, 55, 106, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              DEEP
            </motion.p>
          </div>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-white/70 mt-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Because I&apos;m <span className="text-[#d4376a]"><span className="font-black">Deep</span>ak</span> and you&apos;re <span className="text-[#c89369]"><span className="font-black">Deep</span>thi</span>.
        </motion.p>

        <motion.p
          className="text-lg text-white/40 mt-4 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          (apo ithu love thana jessy... hehehee)
        </motion.p>

        <motion.p
          className="text-lg text-white/50 mt-6 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Our names hold the same essence. Deep in meaning, deep in connection, deep in everything that matters.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function MeaningSection() {
  return (
    <motion.div className="relative text-center max-w-3xl mx-auto">
      <div className="pointer-events-none absolute inset-0">
        <motion.svg
          viewBox="0 0 120 120"
          className="absolute -left-4 top-8 h-20 w-20 text-[#d4376a]/60 md:-left-14 md:top-4 md:h-28 md:w-28"
          initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: [-12, -8, -12], y: [0, -6, 0] }}
          transition={{ duration: 4.5, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }}
          fill="none"
        >
          <path
            d="M60 101C23 79 11 57 11 38c0-11 8-20 19-20 10 0 18 7 24 16 6-9 14-16 24-16 11 0 19 9 19 20 0 19-12 41-37 63Z"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29 22c4-4 8-6 13-6M91 22c-4-4-8-6-13-6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.svg>

        <motion.svg
          viewBox="0 0 140 140"
          className="absolute right-0 top-12 h-20 w-20 text-[#c89369]/70 md:-right-10 md:top-0 md:h-28 md:w-28"
          initial={{ opacity: 0, scale: 0.75, rotate: 8 }}
          animate={{ opacity: 1, scale: 1, rotate: [8, 12, 8], y: [0, 5, 0] }}
          transition={{ duration: 5.2, delay: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          fill="none"
        >
          <path d="M70 18v32M70 90v32M18 70h32M90 70h32M34 34l22 22M84 84l22 22M106 34 84 56M56 84 34 106" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <circle cx="70" cy="70" r="12" stroke="currentColor" strokeWidth="4" />
        </motion.svg>

        <motion.svg
          viewBox="0 0 160 120"
          className="absolute -left-2 bottom-24 h-16 w-24 text-white/35 md:-left-12 md:bottom-28 md:h-20 md:w-32"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0, y: [0, 4, 0] }}
          transition={{ duration: 4.8, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          fill="none"
        >
          <path
            d="M16 86c18-28 43-42 67-37 18 4 31 19 29 34-3 18-25 27-46 23-17-3-30-16-31-31 0-8 3-16 8-22"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="m86 25 15 4-12 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>

        <motion.svg
          viewBox="0 0 120 120"
          className="absolute bottom-6 right-4 h-16 w-16 text-[#d4376a]/45 md:right-0 md:bottom-10 md:h-24 md:w-24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: [0, 5, 0], y: [0, -4, 0] }}
          transition={{ duration: 4.3, delay: 0.65, repeat: Infinity, ease: 'easeInOut' }}
          fill="none"
        >
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="7 8" />
          <path d="M48 52h.01M72 52h.01" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M46 72c7 8 21 8 28 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-4xl md:text-5xl font-bold text-white mb-12"
      >
        What You Mean to Me
      </motion.h2>

      {['My Relief', 'My Stress Buster', 'My Peace', 'My Happiness'].map((item, index) => (
        <motion.div
          key={item}
          className="relative z-10 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-xl p-6 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 55, 106, 0.1)' }}
        >
          <p className="text-2xl font-semibold text-[#d4376a]">{item}</p>
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p className="text-white/70 text-lg leading-relaxed mb-4">
          I wish I could celebrate this day with you, being there in person. I'm sorry I can't hold you today. But know this—
        </p>
        <p className="text-xl text-[#c89369] font-semibold italic">
          "Epovum koodathaan iruppen"
        </p>
        <p className="text-white/50 text-sm mt-2">
          (I will always be with you)
        </p>
      </motion.div>
    </motion.div>
  );
}

function FallingSection() {
  return (
    <motion.div className="text-center max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-12"
      >
        I Keep Falling
      </motion.h2>

      <motion.div
        className="relative mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#8b2d50]/30 to-transparent rounded-3xl blur-2xl" />
        <div className="relative bg-gradient-to-b from-[#2d1f28] to-[#1a0f15] backdrop-blur-md border border-[#d4376a]/20 rounded-3xl p-12">
          <motion.div className="mb-6 flex justify-center">
            <Moon className="w-16 h-16 text-[#c89369] drop-shadow-lg" />
          </motion.div>

          <p className="text-white/80 text-lg leading-relaxed mb-6">
            When you smile. When you laugh. When you get possessive over little things. When you're just being you.
          </p>

          <motion.p
            className="text-2xl text-[#d4376a] font-semibold italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            "Innum konja neram irundha thaan ena…"
          </motion.p>
          <p className="text-white/50 text-sm mt-2">
            (If there was just a little more time...)
          </p>
        </div>
      </motion.div>

      <motion.p
        className="text-white/70 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        This is the dream I live in—falling deeper every single day.
      </motion.p>
    </motion.div>
  );
}

function ConfessionSection() {
  return (
    <motion.div className="text-center max-w-3xl mx-auto">
      <motion.div
        className="relative mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#d4376a] to-[#c89369] rounded-full blur-3xl opacity-60" />
        <div className="relative bg-gradient-to-br from-[#d4376a]/40 to-[#8b2d50]/40 backdrop-blur-md border border-[#d4376a]/60 rounded-full p-2">
          <div className="bg-[#0a0a0a] rounded-full p-8">
            <Heart className="w-16 h-16 text-[#d4376a] mx-auto drop-shadow-lg" fill="#d4376a" />
          </div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold text-white mb-8"
      >
        What I Never Said
      </motion.h2>

      <motion.div
        className="bg-gradient-to-br from-[#d4376a]/30 to-[#8b2d50]/30 backdrop-blur-md border border-[#d4376a]/40 rounded-2xl p-10 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <p className="text-white/80 text-lg leading-relaxed mb-6">
          I want to be your best friend. Your lover. Your future husband. I wish to show you care and love like your dad does: steady, protective, safe, and always there.
        </p>

        <motion.div
          className="bg-black/50 rounded-xl p-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-white/70 italic text-lg">
            "Unakku naan best friend-ah irukkanum, lover-ah irukkanum, future-la Nalla Husband-ah irukkanum… Oru Appa va nalla caring and love tharanum, Aaga motham un koodave irukkanum."
          </p>
          <p className="text-white/50 text-sm mt-4">
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function JoySection() {
  return (
    <motion.div className="text-center max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-12"
      >
        Your Happiness Makes Me Whole
      </motion.h2>

      <motion.div
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-white/80 text-lg leading-relaxed mb-8">
          When you get excited. When you smile at the thought of me coming to Kumbakonam. When our video calls light up your face.
        </p>

        <p className="text-white/80 text-lg leading-relaxed">
          Seeing your inner child feel safe, loved, and cherished—that's when I truly feel alive. You make me want to be the person who protects that joy forever.
        </p>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-[#d4376a]/20 to-[#c89369]/20 backdrop-blur-md border border-[#d4376a]/30 rounded-2xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Heart className="w-12 h-12 text-[#d4376a] mx-auto mb-4" fill="#d4376a" />
        <p className="text-white/70 text-lg italic">
          Your smile is my greatest achievement.
        </p>
      </motion.div>
    </motion.div>
  );
}

function TeamSection() {
  const tamilLines = [
    'Maravathae manam',
    'Madinthalum varum',
    'Mudhal nee',
    'Mudivum nee',
    'Alar nee',
    'Agilam nee',
  ];

  return (
    <motion.div className="text-center max-w-3xl mx-auto relative">
      {/* Animated background Tamil text */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        {tamilLines.map((line, index) => (
          <motion.div
            key={index}
            className="text-white/30 text-lg md:text-xl font-semibold absolute"
            animate={{
              y: [-100, 50],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: index * 0.5,
              ease: 'easeInOut',
            }}
            style={{
              left: `${10 + index * 15}%`,
              top: '50%',
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          When We Fight...
        </h2>

        <div className="bg-gradient-to-br from-[#d4376a]/40 to-[#8b2d50]/40 backdrop-blur-md border border-[#d4376a]/50 rounded-2xl p-12 mb-8">
          <motion.p
            className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            It's Not About Who's <span className="text-[#d4376a]">Right</span> or <span className="text-[#c89369]">Wrong</span>
          </motion.p>
        </div>

        <motion.p
          className="text-white/80 text-lg leading-relaxed mb-8 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          It's Always About <span className="text-[#d4376a] text-2xl">US</span>
        </motion.p>

        <motion.p
          className="text-white/70 text-lg leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          The heart forgets the words, but remembers how you made it feel. When we argue, we often forget this simple truth. But you and me—we're bigger than any disagreement.
        </motion.p>

        <motion.p
          className="text-white/70 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Because at the end of every fight, it's still us. Always us.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function FinalSection() {
  const lines = [
    'Maravathae manam',
    'Madinthalum varum',
    'Mudhal nee',
    'Mudivum nee',
    'Alar nee',
    'Agilam nee',
  ];

  return (
    <motion.div className="relative w-full max-w-4xl mx-auto overflow-hidden text-center">
      <div className="absolute inset-0 pointer-events-none">
        {lines.map((line, index) => (
          <motion.div
            key={line}
            className="absolute text-base italic text-white/25 md:text-lg"
            initial={{ opacity: 0, y: -12 }}
            animate={{
              opacity: [0.06, 0.22, 0.06],
              x: [0, index % 2 === 0 ? 18 : -18, 0],
              y: [0, 26, 52],
            }}
            transition={{
              duration: 7 + index * 0.45,
              repeat: Infinity,
              delay: index * 0.35,
              ease: 'easeInOut',
            }}
            style={{
              left: `${14 + index * 11}%`,
              top: `${10 + (index % 3) * 10}%`,
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      <motion.div className="relative z-10 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          If Someone Asked Me...
        </h2>

        <motion.div
          className="bg-gradient-to-br from-[#d4376a]/30 to-[#8b2d50]/30 backdrop-blur-md border border-[#d4376a]/40 rounded-2xl p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.p
            className="text-2xl md:text-3xl font-bold text-[#d4376a] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            What is love?
          </motion.p>
          <p className="text-white/80 text-lg mb-6">It's you.</p>

          <motion.p
            className="text-2xl md:text-3xl font-bold text-[#d4376a] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            What is happiness?
          </motion.p>
          <p className="text-white/80 text-lg mb-6">It's you.</p>

          <motion.p
            className="text-2xl md:text-3xl font-bold text-[#d4376a] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            What is my future?
          </motion.p>
          <p className="text-white/80 text-lg mb-8">It's you.</p>

          <motion.div
            className="mt-10 border-t border-white/10 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <p className="text-[0.72rem] font-black uppercase tracking-[0.36em] text-white/35">
              Which basically means
            </p>
            <p className="mt-4 text-xl text-white/68 md:text-2xl">
              You&apos;re not just part of my life.
            </p>
            <p className="mt-3 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff7aa6] via-[#ffd4df] to-[#c89369] md:text-4xl">
              You&apos;re my 🤍
            </p>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-[#c89369] font-bold mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          — Deeps
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function AskSection() {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);

  const handleNoHover = () => {
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    setYesClicked(true);
  };

  return (
    <motion.div className="text-center max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-white mb-8"
      >
        Do you love me?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-xl text-white/70 mb-16 leading-relaxed"
      >
        With all your heart, with all your soul, forever and always?
      </motion.p>

      {!yesClicked ? (
        <motion.div
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleYesClick}
            className="relative px-12 py-6 bg-gradient-to-br from-[#d4376a] to-[#8b2d50] hover:from-[#e84a7f] hover:to-[#a03d62] text-white font-bold text-xl rounded-full shadow-lg hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes
          </motion.button>

          <motion.button
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            className="relative px-12 py-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xl rounded-full border border-white/30 transition-all cursor-pointer"
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            No
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="bg-gradient-to-br from-[#d4376a]/30 to-[#8b2d50]/30 backdrop-blur-md border border-[#d4376a]/40 rounded-2xl p-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-3xl text-[#d4376a] font-bold mb-4">I knew it.</p>
            <p className="text-white/80 text-lg leading-relaxed">
              Because I love you too. With every breath, every heartbeat, every moment of my existence.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-white/70 text-lg mb-4 leading-relaxed italic">
              Now, one more thing I need to know...
            </p>
            <p className="text-[#c89369] text-xl font-semibold">
              Will you make me the luckiest man alive and spend forever with me?
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SongSection() {
  const floatingWords = [
    { text: 'first thought', left: '8%', top: '18%', delay: 0 },
    { text: 'last peace', left: '74%', top: '16%', delay: 0.35 },
    { text: 'still you', left: '14%', top: '78%', delay: 0.7 },
    { text: 'every time', left: '72%', top: '76%', delay: 1.05 },
  ];

  const feelings = [
    'You feel like the first thought my heart goes to.',
    'You feel like the quiet that wins after every chaos.',
    'You feel like the ending I would still choose on purpose.',
  ];

  return (
    <motion.div className="relative w-full max-w-5xl mx-auto overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-[8%] top-[10%] h-40 w-40 rounded-full bg-[#d4376a]/15 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[6%] right-[6%] h-52 w-52 rounded-full bg-[#c89369]/12 blur-3xl"
          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.72, 0.35] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {floatingWords.map((word) => (
          <motion.div
            key={word.text}
            className="absolute text-sm font-semibold uppercase tracking-[0.35em] text-white/12 md:text-base"
            animate={{
              y: [0, -22, 0],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              delay: word.delay,
              ease: 'easeInOut',
            }}
            style={{ left: word.left, top: word.top }}
          >
            {word.text}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-xl md:px-12 md:py-12"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mb-8 text-center md:mb-12"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="mb-4 text-[0.72rem] font-black uppercase tracking-[0.5em] text-[#c89369]/80">
            P.S you're the heroine for all the songs i listen to
          </p>
          <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Mudhal Nee
            <span className="block bg-gradient-to-r from-[#ff76a2] via-[#ffd4df] to-[#c89369] bg-clip-text text-transparent">
              Mudivum Nee
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/68 md:text-xl">
            Some songs stop sounding like music and start sounding like one person.
            Very annoying behavior. Very you.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            className="rounded-[1.75rem] border border-[#d4376a]/25 bg-gradient-to-br from-[#2a121b]/90 via-[#341622]/80 to-[#1b0f15]/90 p-8 shadow-2xl shadow-[#d4376a]/10"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="mb-6 text-xs font-black uppercase tracking-[0.36em] text-[#ff8fb4]/75">
              What It Feels Like
            </p>
            <div className="space-y-5">
              {feelings.map((feeling, index) => (
                <motion.div
                  key={feeling}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 + index * 0.15 }}
                >
                  <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-[#ff76a2] to-[#c89369]" />
                  <p className="text-xl font-semibold leading-relaxed text-white/88">{feeling}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col justify-between gap-6 rounded-[1.75rem] border border-[#c89369]/20 bg-gradient-to-b from-[#f5d2da]/95 via-[#f4d8c0]/90 to-[#f1dccd]/92 p-8 text-[#4c2230]"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.36em] text-[#8c4a5c]/70">
                Side Effect
              </p>
              <p className="text-3xl font-black leading-tight md:text-4xl">
                Now every soft line starts sounding suspiciously personal.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-[#4c2230]/8 p-6">
              <p className="text-sm font-black uppercase tracking-[0.32em] text-[#8c4a5c]/70">
                Translation
              </p>
              <p className="mt-4 text-lg leading-relaxed text-[#5f2a3b]/85">
                One song, one girl, and suddenly I am staring at the screen like this was written
                to personally expose me.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Celebration Component
function CelebrationSection({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Celebration Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Explosive glow effect */}
        <motion.div
          className="absolute inset-0 bg-radial-gradient from-[#d4376a]/30 via-transparent to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Floating hearts */}
        {CELEBRATION_HEARTS.map((heart) => (
          <motion.div
            key={`heart-${heart.id}`}
            className="absolute"
            style={{
              left: heart.left,
              bottom: '-10vh',
            }}
            initial={{
              y: 0,
              opacity: 1,
            }}
            animate={{
              y: '-110vh',
              opacity: 0,
              rotate: heart.rotate,
            }}
            transition={{
              duration: heart.duration,
              ease: 'easeOut',
            }}
          >
            <Heart size={heart.size} className="text-[#d4376a]" fill="#d4376a" />
          </motion.div>
        ))}

        {/* Sparkle particles */}
        {SPARKLE_PARTICLES.map((sparkle) => (
          <motion.div
            key={`sparkle-${sparkle.id}`}
            className="absolute w-1 h-1 bg-[#c89369] rounded-full"
            style={{
              left: sparkle.left,
              top: sparkle.top,
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
            }}
          />
        ))}
      </div>

      {/* Main Celebration Content */}
      <motion.div
        className="relative z-10 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: 'spring' }}
      >
        <motion.div
          className="mb-12"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Heart className="w-40 h-40 text-[#d4376a] mx-auto drop-shadow-2xl" fill="#d4376a" />
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black text-white mb-8 text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Happy Birthday
        </motion.h1>

        <motion.p
          className="text-3xl md:text-4xl text-[#d4376a] font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          You Are My Everything
        </motion.p>

        <motion.p
          className="text-xl text-white/80 mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Thank you for being the best part of my life.
        </motion.p>

        <motion.button
          onClick={onReplay}
          className="bg-gradient-to-r from-[#d4376a] to-[#8b2d50] hover:from-[#e6478e] hover:to-[#9a3460] text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-[#d4376a]/50 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Relive This Again 💕
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
