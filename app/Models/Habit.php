<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Habit
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $category_id
 * @property string $name
 * @property string|null $description
 * @property int $target_frequency
 * @property array $completion_dates
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @property-read Category|null $category
 * @property-read bool $is_completed_today
 * @property-read int $current_streak
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Habit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Habit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Habit query()
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereCompletionDates($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereTargetFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Habit whereUserId($value)
 * @method static \Database\Factories\HabitFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Habit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'description',
        'target_frequency',
        'completion_dates',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'completion_dates' => 'array',
        'target_frequency' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the habit.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the habit belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Check if the habit is completed today.
     */
    public function getIsCompletedTodayAttribute(): bool
    {
        $today = today()->format('Y-m-d');
        return in_array($today, $this->completion_dates ?? []);
    }

    /**
     * Get the current streak for the habit.
     */
    public function getCurrentStreakAttribute(): int
    {
        $dates = collect($this->completion_dates ?? [])->sort()->reverse();
        $streak = 0;
        $currentDate = today();

        foreach ($dates as $date) {
            $completionDate = \Carbon\Carbon::parse($date);
            
            if ($completionDate->isSameDay($currentDate)) {
                $streak++;
                $currentDate = $currentDate->subDay();
            } else if ($completionDate->isBefore($currentDate)) {
                break;
            }
        }

        return $streak;
    }

    /**
     * Mark habit as completed for today.
     */
    public function markAsCompleted(): void
    {
        $today = today()->format('Y-m-d');
        $dates = $this->completion_dates ?? [];
        
        if (!in_array($today, $dates)) {
            $dates[] = $today;
            $this->update(['completion_dates' => $dates]);
        }
    }

    /**
     * Mark habit as not completed for today.
     */
    public function markAsNotCompleted(): void
    {
        $today = today()->format('Y-m-d');
        $dates = $this->completion_dates ?? [];
        
        $dates = array_filter($dates, fn($date) => $date !== $today);
        $this->update(['completion_dates' => array_values($dates)]);
    }
}