-- Workouts table for fitness tracking
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  workout_type TEXT CHECK (workout_type IN ('strength', 'cardio', 'yoga', 'sports', 'walking', 'cycling', 'swimming', 'other')),
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Duration and metrics
  duration_minutes INTEGER,
  calories_burned INTEGER,
  distance_km DECIMAL(6,2),

  -- Notes
  notes TEXT,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workouts_owner ON workouts(owner_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(owner_id, workout_date);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own workouts" ON workouts;
CREATE POLICY "Users can CRUD their own workouts"
  ON workouts FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Exercises within a workout
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  exercise_name TEXT NOT NULL,
  sets INTEGER,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  duration_seconds INTEGER,
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout ON workout_exercises(workout_id);

ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own workout exercises" ON workout_exercises;
CREATE POLICY "Users can CRUD their own workout exercises"
  ON workout_exercises FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Weight log for body weight tracking
CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  log_date DATE NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(owner_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_owner ON weight_logs(owner_id, log_date);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own weight logs" ON weight_logs;
CREATE POLICY "Users can CRUD their own weight logs"
  ON weight_logs FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
