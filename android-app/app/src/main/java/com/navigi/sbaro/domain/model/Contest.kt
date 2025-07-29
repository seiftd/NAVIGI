package com.navigi.sbaro.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class Contest(
    val id: String = "",
    val type: ContestType,
    val title: String = "",
    val description: String = "",
    val requirement: Int = 0,
    val startDate: String = "",
    val endDate: String = "",
    val totalPrizePool: Long = 0L,
    val participants: List<ContestParticipant> = emptyList(),
    val winners: List<ContestWinner> = emptyList(),
    val status: ContestStatus = ContestStatus.ACTIVE,
    val isAutomatic: Boolean = true,
    val createdBy: String = "system",
    val createdAt: String = "",
    val completedAt: String = "",
    val maxParticipants: Int = -1, // -1 means unlimited
    val entryFee: Long = 0L, // 0 means free
    val rules: List<String> = emptyList()
)

@Serializable
data class ContestParticipant(
    val userId: String,
    val userName: String,
    val joinedAt: String,
    val currentProgress: Int = 0,
    val isEligible: Boolean = false,
    val completedAt: String = ""
)

@Serializable
data class ContestWinner(
    val userId: String,
    val userName: String,
    val position: Int,
    val prizePoints: Long,
    val progress: Int,
    val awardedAt: String = ""
)

enum class ContestStatus {
    UPCOMING,
    ACTIVE,
    COMPLETED,
    CANCELLED
}

// Extension functions for Contest model
fun Contest.isActive(): Boolean = status == ContestStatus.ACTIVE

fun Contest.isCompleted(): Boolean = status == ContestStatus.COMPLETED

fun Contest.getParticipantCount(): Int = participants.size

fun Contest.getEligibleParticipants(): List<ContestParticipant> = 
    participants.filter { it.isEligible }

fun Contest.getRemainingSlots(): Int = 
    if (maxParticipants == -1) Int.MAX_VALUE else maxParticipants - participants.size

fun Contest.canJoin(): Boolean = 
    isActive() && getRemainingSlots() > 0

fun Contest.getWinnerCount(): Int = when (type) {
    ContestType.DAILY -> 1
    ContestType.WEEKLY -> 5
    ContestType.MONTHLY -> 20
}

fun Contest.getAdminShare(): Double = when (type) {
    ContestType.DAILY -> 0.6 // 60%
    ContestType.WEEKLY -> 0.25 // 25%
    ContestType.MONTHLY -> 0.4 // 40%
}

fun Contest.getIndividualPrize(): Long = when (type) {
    ContestType.DAILY -> (totalPrizePool * 0.4).toLong() // Winner gets 40%
    ContestType.WEEKLY -> (totalPrizePool * 0.75 / 5).toLong() // Each winner gets 15%
    ContestType.MONTHLY -> (totalPrizePool * 0.6 / 20).toLong() // Each winner gets 3%
}

fun Contest.getTimeRemaining(): String {
    // This would need actual time calculation implementation
    return ""
}

fun Contest.getProgressPercentage(userId: String): Float {
    val participant = participants.find { it.userId == userId }
    return if (participant != null && requirement > 0) {
        (participant.currentProgress.toFloat() / requirement).coerceAtMost(1f)
    } else {
        0f
    }
}