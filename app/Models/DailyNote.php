<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\DailyNote
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $category_id
 * @property string $title
 * @property string $content
 * @property \Illuminate\Support\Carbon $note_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @property-read Category|null $category
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote query()
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereNoteDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyNote today()

 * 
 * @mixin \Eloquent
 */
class DailyNote extends Model
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
        'title',
        'content',
        'note_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'note_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the daily note.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the daily note belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope a query to only include today's notes.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('note_date', today());
    }
}